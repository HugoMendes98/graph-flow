import { EventArgs, EventSubscriber, Reference } from "@mikro-orm/core";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GraphNode } from "~/lib/common/app/graph/endpoints";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import { EntitiesToPopulate, EntityFilter, EntityFindParams } from "~/lib/common/endpoints";

import { NodeReadonlyKindTypeException } from "./exceptions";
import { NodeInputEntity, NodeInputCreate } from "./input";
import { NODE_KIND_ENTITIES, NodeKindEntity } from "./kind";
import { NodeEntity } from "./node.entity";
import { NodeRepository } from "./node.repository";
import { NodeOutputEntity, NodeOutputCreate } from "./output";
import {
	EntityLoaded,
	EntityService,
	EntityServiceCreateOptions,
	EntityServiceFindOptions
} from "../_lib/entity";
import { CategoryEntity } from "../category/category.entity";
import { GraphEntity } from "../graph/graph.entity";
import { GraphService } from "../graph/graph.service";
import {
	GraphNodeTriggerInFunctionException,
	GraphNodeTriggerInWorkflowException
} from "../graph/node/exceptions";

/** Interface to create {@link NodeEntity} */
export interface NodeCreateEntity
	extends Omit<NodeCreateDto, "behavior">,
		Pick<NodeDto, "behavior"> {}

/**
 * Service to manages [nodes]{@link NodeEntity}.
 */
@Injectable()
export class NodeService
	extends EntityService<NodeEntity, NodeCreateEntity, NodeUpdateDto>
	implements EventSubscriber<NodeEntity>
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 * @param graphService injected
	 */
	public constructor(
		repository: NodeRepository,
		@Inject(forwardRef(() => GraphService))
		private readonly graphService: GraphService
	) {
		super(repository);

		const eventManager = repository.getEntityManager().getEventManager();
		eventManager.registerSubscriber(this);
		eventManager.registerSubscriber({
			getSubscribedEntities: () => [...NODE_KIND_ENTITIES],

			beforeUpdate(args: EventArgs<NodeKindEntity>): Promise<void> | void {
				const { changeSet } = args;
				if (!changeSet) {
					return;
				}

				const { entity, originalEntity } = changeSet;
				if (!originalEntity?.type || originalEntity.type !== entity.type) {
					throw new NodeReadonlyKindTypeException();
				}
			}
		});
	}

	/** @inheritDoc */
	public getSubscribedEntities() {
		return [NodeEntity];
	}

	/** @inheritDoc */
	public async beforeCreate(args: EventArgs<NodeEntity>) {
		const { behavior, kind } = args.entity;

		if (behavior.type !== NodeBehaviorType.TRIGGER || kind.type !== NodeKindType.EDGE) {
			// Nothing to verify it the node is not a `trigger`
			return;
		}

		// TODO: A way to add custom relation in the EntityRelationsKey?
		const behaviorRelation: keyof GraphEntity = "nodeBehavior";
		const { nodeBehavior, workflow } = await this.graphService.findById(kind.__graph, {
			populate: { [behaviorRelation]: true, workflow: true }
		});

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- exists (reversed relation)
		if (nodeBehavior) {
			throw new GraphNodeTriggerInFunctionException();
		}

		if (workflow) {
			const {
				pagination: { total }
			} = await this.findAndCount(
				{
					behavior: { type: NodeBehaviorType.TRIGGER },
					kind: { __graph: kind.__graph, type: NodeKindType.EDGE }
				},
				{ limit: 0 }
			);

			if (total > 0) {
				throw new GraphNodeTriggerInWorkflowException();
			}
		}
	}

	/**
	 * Finds nodes related to a graph
	 *
	 * @see EntityService
	 * @param graphId The graph id to look for
	 * @param where Filter to apply
	 * @param params Additional parameters to sort and/or paginate
	 * @param options Some options when loading an entities
	 * @returns All nodes from a graph
	 */
	public findByGraph<P extends EntitiesToPopulate<DtoToEntity<GraphNode>>>(
		graphId: EntityId,
		where: EntityFilter<DtoToEntity<GraphNode>> = {},
		params: EntityFindParams<DtoToEntity<GraphNode>> = {},
		options?: EntityServiceFindOptions<DtoToEntity<GraphNode>, P>
	) {
		// GraphNodeDto
		return this.findAndCount(
			{ $and: [{ kind: { __graph: graphId, type: NodeKindType.EDGE } }, where] },
			params,
			options
		) as Promise<
			FindResultsDto<EntityLoaded<DtoToEntity<GraphNode & Pick<NodeEntity, "toJSON">>, P>>
		>;
	}

	public override async create<P extends EntitiesToPopulate<NodeEntity>>(
		toCreate: NodeCreateEntity,
		options?: EntityServiceCreateOptions<NodeEntity, P>
	): Promise<EntityLoaded<NodeEntity, P>> {
		return super.create(toCreate, options).then(async created => {
			const { behavior } = created;
			if (behavior.type !== NodeBehaviorType.REFERENCE) {
				return created;
			}

			// "Copy" inputs and outputs

			// TODO: in another function
			// FIXME: in the `afterCreate` hook. (Currently an error with seeding)
			const reference = await this.findById(behavior.__node);

			const em = this.repository.getEntityManager();
			for (const [collection, entity] of [
				[reference.inputs, NodeInputEntity],
				[reference.outputs, NodeOutputEntity]
			] as const) {
				for (const { _id, name, type } of collection) {
					em.create(entity, {
						__node: created._id,
						__ref: _id,
						name,
						type
					} satisfies NodeInputCreate | NodeOutputCreate as never);
				}
			}

			await em.flush();

			// Fill the values
			await created.inputs.init();
			await created.outputs.init();

			return created;
		});
	}

	/**
	 * Adds a category to a node.
	 * Nothing happens if the category is already linked to the given node
	 *
	 * @param nodeId The id of the node to add the category to
	 * @param categoryId The id of the category to add
	 * @returns The updated node
	 */
	public addCategory(nodeId: EntityId, categoryId: EntityId) {
		return this.findById(nodeId, { populate: { categories: true } }).then(async node => {
			node.categories.add(Reference.createFromPK(CategoryEntity, categoryId));

			await this.repository.getEntityManager().persistAndFlush(node);
			return node;
		});
	}

	/**
	 * Removes a category from a node.
	 * Nothing happens if the category does not exist or not linked
	 *
	 * @param nodeId The id of the node to remove the category from
	 * @param categoryId The id of the category to remove
	 * @returns The updated node
	 */
	public removeCategory(nodeId: EntityId, categoryId: EntityId) {
		return this.findById(nodeId, { populate: { categories: true } }).then(async node => {
			const categories = await node.categories.matching({
				where: { _id: { $eq: categoryId } }
			});

			if (categories.length === 0) {
				return node;
			}

			node.categories.remove(categories[0]);

			await this.repository.getEntityManager().persistAndFlush(node);
			return node;
		});
	}
}
