import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { EntityId } from "~/lib/common/dtos/entity";

import { WorkflowEntity } from "./workflow.entity";
import { WorkflowExecutor } from "./workflow.executor";
import { WorkflowService } from "./workflow.service";

/**
 * Class to schedule workflows.
 * Only for `node-trigger` of CRON type (for now)
 *
 * Internal to Workflow module, so no data integrity tested.
 */
@Injectable()
export class WorkflowScheduler {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param scheduler injected
	 * @param service injected
	 * @param executor injected
	 */
	public constructor(
		private readonly scheduler: SchedulerRegistry,
		@Inject(forwardRef(() => WorkflowService))
		private readonly service: WorkflowService,
		@Inject(forwardRef(() => WorkflowExecutor))
		private readonly executor: WorkflowExecutor
	) {}

	/**
	 * Determines if a workflow is already registered
	 *
	 * @param workflow to test
	 * @returns if the workflow is already registered
	 */
	public isRegistered(workflow: WorkflowEntity) {
		return this.scheduler.getCronJobs().has(this.getCronJobName(workflow._id));
	}

	/**
	 * Adds a workflow to be executed from cron.
	 *
	 * @param workflow to register
	 * @returns Promise after operation
	 */
	public async register(workflow: WorkflowEntity) {
		const {
			trigger: { trigger }
		} = await this.service.findTrigger(workflow);

		// A shallow copy in case the reference changes
		const { ...shallow } = workflow;
		const job = new CronJob(trigger.cron, () => void this.executor.executeAndLog(shallow));
		this.scheduler.addCronJob(this.getCronJobName(workflow._id), job);
		job.start();
	}

	/**
	 * Removes the execution for a workflow
	 *
	 * @param workflow to unregister
	 * @returns Promise after operation
	 */
	public async unregister(workflow: WorkflowEntity) {
		await this.service.findTrigger(workflow);

		const cronName = this.getCronJobName(workflow._id);
		this.scheduler.getCronJobs().get(cronName)?.stop();
		this.scheduler.deleteCronJob(cronName);
	}

	/**
	 * Removes and re-add a workflow.
	 * It works even if the workflow was not already registered
	 *
	 * @see register
	 * @see unregister
	 * @param workflow to refresh
	 * @returns Promise after operation
	 */
	public refresh(workflow: WorkflowEntity) {
		return this.unregister(workflow).then(() => this.register(workflow));
	}

	private getCronJobName = (id: EntityId) => `workflow-cron-${id}`;
}
