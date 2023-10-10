import { CreateRequestContext, EventArgs, EventSubscriber, MikroORM } from "@mikro-orm/core";
import { forwardRef, Inject, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/app/workflow/dtos";
import { EntityId } from "~/lib/common/dtos/entity";

import { WorkflowNoTriggerException } from "./exceptions";
import { WorkflowEntity } from "./workflow.entity";
import { WorkflowRepository } from "./workflow.repository";
import { WorkflowScheduler } from "./workflow.scheduler";
import { EntityService } from "../_lib/entity";
import { GraphService } from "../graph/graph.service";
import { NodeBehaviorTrigger } from "../node/behaviors/node-behavior.trigger";
import { NodeService } from "../node/node.service";

/**
 * Service to manages [workflows]{@link WorkflowEntity}.
 */
@Injectable()
export class WorkflowService
	extends EntityService<WorkflowEntity, WorkflowCreateDto, WorkflowUpdateDto>
	implements EventSubscriber<WorkflowEntity>, OnModuleInit
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 * @param orm injected
	 * @param workflowScheduler injected
	 * @param graphService injected
	 * @param nodeService injected
	 */
	public constructor(
		repository: WorkflowRepository,
		// For `@UseRequestContext`
		private readonly orm: MikroORM,
		@Inject(forwardRef(() => WorkflowScheduler))
		private readonly workflowScheduler: WorkflowScheduler,
		private readonly graphService: GraphService,
		private readonly nodeService: NodeService
	) {
		super(repository);

		repository.getEntityManager().getEventManager().registerSubscriber(this);
	}

	/** @inheritDoc */
	public getSubscribedEntities() {
		return [WorkflowEntity];
	}

	/** @inheritDoc */
	public async beforeUpdate(args: EventArgs<WorkflowEntity>) {
		const { changeSet, entity } = args;
		if (!changeSet) {
			return;
		}

		if (changeSet.payload.active === true) {
			await this.findTrigger(entity).catch((error: unknown) => {
				if (error instanceof NotFoundException) {
					throw new WorkflowNoTriggerException(error.message);
				}

				throw error;
			});
		}
	}

	/** @inheritDoc */
	@CreateRequestContext()
	public async onModuleInit() {
		const { data: workflows } = await this.findAndCount({ active: true });

		await Promise.all(workflows.map(workflow => this.workflowScheduler.register(workflow)));
	}

	/** @inheritDoc */
	public override delete(id: EntityId): Promise<WorkflowEntity> {
		return this.findById(id, { populate: { graph: true } }).then(async entity => {
			// Cascade integrity -> deleting the graph deletes the workflow
			// TODO: Reverse the relation ? Remove the cascade and delete manually
			await this.graphService._deleteFromParent(entity.graph);
			return entity;
		});
	}

	/**
	 * Gets the trigger node for the given workflow
	 *
	 * @param workflow The workflow to get the trigger from
	 * @throws NotFoundException when no trigger is found
	 * @returns the trigger node for the given workflow
	 */
	public async findTrigger(workflow: WorkflowEntity) {
		const { __graph, _id } = workflow;

		const { data } = await this.nodeService.findAndCount(
			{
				$or: [
					// Trigger directly set in the workflows
					{ behavior: { type: NodeBehaviorType.TRIGGER } }
					// { TODO
					// 	// Or via a reference
					// 	behavior: {
					// 		node: { behavior: { type: NodeBehaviorType.TRIGGER } },
					// 		type: NodeBehaviorType.REFERENCE
					// 	}
					// }
				],
				kind: { __graph, type: NodeKindType.VERTEX }
			},
			{ limit: 1 }
		);

		if (data.length !== 1) {
			throw new NotFoundException(`No trigger found for the workflow ${_id}`);
		}

		const [node] = data;
		return {
			node,
			trigger: node.behavior as NodeBehaviorTrigger
		};
	}
}
