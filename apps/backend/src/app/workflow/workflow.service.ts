import { EventArgs, EventSubscriber, MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/app/workflow/dtos";
import { EntityId } from "~/lib/common/dtos/entity";

import { WorkflowNoTriggerException } from "./exceptions";
import { Workflow } from "./workflow.entity";
import { WorkflowRepository } from "./workflow.repository";
import { EntityService } from "../_lib/entity";
import { GraphService } from "../graph/graph.service";
import { GraphNodeService } from "../graph/node/graph-node.service";
import { NodeTrigger } from "../node/behaviors/triggers";

/**
 * Service to manages [workflows]{@link Workflow}.
 */
@Injectable()
export class WorkflowService
	extends EntityService<Workflow, WorkflowCreateDto, WorkflowUpdateDto>
	implements EventSubscriber<Workflow>, OnModuleInit
{
	public constructor(
		repository: WorkflowRepository,
		// For `@UseRequestContext`
		private readonly orm: MikroORM,
		private readonly graphService: GraphService,
		private readonly graphNodeService: GraphNodeService
	) {
		super(repository);

		repository.getEntityManager().getEventManager().registerSubscriber(this);
	}

	/**
	 * @inheritDoc
	 */
	public getSubscribedEntities() {
		return [Workflow];
	}

	public async beforeUpdate(args: EventArgs<Workflow>) {
		const { changeSet, entity } = args;
		if (!changeSet) {
			return;
		}

		if (changeSet.payload.active === true) {
			await this.getTrigger(entity).catch((error: unknown) => {
				if (error instanceof NotFoundException) {
					throw new WorkflowNoTriggerException(error.message);
				}

				throw error;
			});
		}
	}

	/**
	 * @inheritDoc
	 */
	@UseRequestContext()
	public async onModuleInit() {
		const { data: workflows } = await this.findAndCount({ active: true });

		await Promise.all(workflows.map(workflow => this.registerWorkflow(workflow)));
	}

	public override delete(id: EntityId): Promise<Workflow> {
		return this.findById(id, { populate: ["graph"] }).then(async entity => {
			// Cascade integrity -> deleting the graph deletes the workflow
			// TODO: Reverse the relation ? Remove the cascade and delete manually
			await this.graphService._deleteFromParent(entity.graph);
			return entity;
		});
	}

	private async registerWorkflow(workflow: Workflow) {
		const trigger = await this.getTrigger(workflow);

		// TODO
	}

	/**
	 * Gets the trigger node for the given workflow
	 *
	 * @param workflow The workflow to get the trigger from
	 * @throws NotFoundException when no trigger is found
	 * @returns the trigger node for the given workflow
	 */
	private async getTrigger(workflow: Workflow) {
		const { __graph, _id } = workflow;

		const { data } = await this.graphNodeService.findAndCount(
			{ __graph, node: { behavior: { type: NodeBehaviorType.TRIGGER } } },
			{ limit: 1 },
			{ populate: ["node"] }
		);

		if (data.length !== 1) {
			throw new NotFoundException(`No trigger found for the workflow ${_id}`);
		}

		const [{ node }] = data;

		type Node = typeof node;
		return node as Node & Record<keyof Pick<Node, "behavior">, NodeTrigger>;
	}
}
