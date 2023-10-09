import { Injectable } from "@nestjs/common";

import { WorkflowEntity } from "./workflow.entity";
import { WorkflowService } from "./workflow.service";
import { GraphExecutor } from "../graph/executor/graph.executor";

@Injectable()
export class WorkflowExecutor {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param graphExecutor injected
	 */
	public constructor(
		private readonly service: WorkflowService,
		private readonly graphExecutor: GraphExecutor
	) {}

	/**
	 * Executes a workflow.
	 *
	 * This will try to execute not matter the state of the workflow graph (except mandatory trigger).
	 * (The service should guarantee the graph)
	 *
	 * @param workflow to execute
	 * @returns Promise when initialized that returns a finish-able observable with events
	 */
	public async execute(workflow: WorkflowEntity) {
		const { node } = await this.service.findTrigger(workflow);
		return this.graphExecutor.execute({ graphId: workflow.__graph, startAt: [node._id] });
	}

	/**
	 * Executes a workflow and logs each event
	 *
	 * @see execute
	 * @param workflow to execute
	 * @returns Promise when initialized that returns a finish-able observable with events
	 */
	public executeAndLog(workflow: WorkflowEntity) {
		// TODO
		return this.execute(workflow);
	}
}
