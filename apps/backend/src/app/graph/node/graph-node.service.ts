import { EntityManager, EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { GraphNodeInputCreateDto } from "~/lib/common/app/graph/dtos/node/input";
import { GraphNodeOutputCreateDto } from "~/lib/common/app/graph/dtos/node/output";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";

import {
	GraphNodeTriggerInFunctionException,
	GraphNodeTriggerInWorkflowException
} from "./exceptions";
import { GraphNode } from "./graph-node.entity";
import { GraphNodeRepository } from "./graph-node.repository";
import { GraphNodeInput } from "./input";
import { GraphNodeOutput } from "./output";
import { EntityRelationKeys, EntityService, EntityServiceCreateOptions } from "../../_lib/entity";
import { NodeService } from "../../node/node.service";
import { Graph } from "../graph.entity";
import { GraphService } from "../graph.service";

export type GraphNodeCreate = GraphNodeCreateDto & Pick<GraphNode, "__graph">;

/**
 * Service to manages [graph-nodes]{@link GraphNode}.
 */
@Injectable()
export class GraphNodeService
	extends EntityService<GraphNode, GraphNodeCreate, GraphNodeUpdateDto>
	implements EventSubscriber<GraphNode>
{
	public constructor(
		repository: GraphNodeRepository,
		entityManager: EntityManager,
		private readonly graphService: GraphService,
		private readonly nodeService: NodeService
	) {
		super(repository);

		// FIXME: getting the eventManager from the repository fails on tests
		entityManager.getEventManager().registerSubscriber(this);
	}

	/**
	 * @inheritDoc
	 */
	public getSubscribedEntities(): Array<EntityName<GraphNode>> {
		return [GraphNode];
	}

	/**
	 * @inheritDoc
	 */
	public async beforeCreate(event: EventArgs<GraphNode>) {
		const {
			entity: { __graph, __node }
		} = event;

		const {
			behavior: { type }
		} = await this.nodeService.findById(__node);

		if (type !== NodeBehaviorType.TRIGGER) {
			// Nothing to verify it the node is not a `trigger`
			return;
		}

		// TODO: A way to add custom relation in the EntityRelationsKey?
		const behaviorRelation: keyof Graph = "nodeBehavior";
		const { nodeBehavior, workflow } = await this.graphService.findById(__graph, {
			populate: [behaviorRelation as never, "workflow"]
		});

		if (nodeBehavior) {
			throw new GraphNodeTriggerInFunctionException();
		}

		if (workflow) {
			const {
				pagination: { total }
			} = await this.findAndCount({ __graph, node: { behavior: { type } } }, { limit: 0 });

			if (total > 0) {
				throw new GraphNodeTriggerInWorkflowException();
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public override async create<P extends EntityRelationKeys<GraphNode>>(
		toCreate: GraphNodeCreate,
		options?: EntityServiceCreateOptions<GraphNode, P>
	) {
		const { inputs, name, outputs } = await this.nodeService.findById(toCreate.__node, {
			populate: ["inputs", "outputs"]
		});

		const { _id } = await this.repository.getEntityManager().transactional(async em => {
			// First create the graph-node to get its inserted id
			const toInsert: GraphNodeCreate = { name, ...toCreate };
			const graphNode = em.getRepository(GraphNode).create(toInsert as never);
			await em.flush();

			// Create the inputs and outputs with the created graph-node
			const inputRepository = em.getRepository(GraphNodeInput);
			const outputRepository = em.getRepository(GraphNodeOutput);

			for (const { _id } of inputs) {
				const toCreate: GraphNodeInputCreateDto = {
					__graph_node: graphNode._id,
					__node_input: _id
				};
				inputRepository.create(toCreate as never);
			}
			for (const { _id } of outputs) {
				const toCreate: GraphNodeOutputCreateDto = {
					__graph_node: graphNode._id,
					__node_output: _id
				};
				outputRepository.create(toCreate as never);
			}

			return graphNode;
		});

		this.clearEM();
		return this.findById<P>(_id, options?.findOptions);
	}
}
