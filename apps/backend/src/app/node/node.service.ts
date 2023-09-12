import { EventArgs, EventSubscriber, Reference } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GraphNodeDto } from "~/lib/common/app/graph/endpoints";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import { EntitiesToPopulate, EntityFilter, EntityFindParams } from "~/lib/common/endpoints";

import { NodeInputEntity, NodeInputCreate } from "./input";
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

/**
 * Service to manages [nodes]{@link NodeEntity}.
 */
@Injectable()
export class NodeService
	extends EntityService<NodeEntity, NodeCreateDto, NodeUpdateDto>
	implements EventSubscriber<NodeEntity>
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 * @param graphService injected
	 * @param nodeExecutor injected
	 */
	public constructor(
		repository: NodeRepository,
		@Inject(forwardRef(() => GraphService))
		private readonly graphService: GraphService
	) {
		super(repository);

		repository.getEntityManager().getEventManager().registerSubscriber(this);
	}

	/**
	 * @inheritDoc
	 */
	public getSubscribedEntities(): Array<EntityName<NodeEntity>> {
		return [NodeEntity];
	}

	/**
	 * @inheritDoc
	 */
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
	public findByGraph<P extends EntitiesToPopulate<DtoToEntity<GraphNodeDto>>>(
		graphId: EntityId,
		where: EntityFilter<DtoToEntity<GraphNodeDto>> = {},
		params: EntityFindParams<DtoToEntity<GraphNodeDto>> = {},
		options?: EntityServiceFindOptions<DtoToEntity<GraphNodeDto>, P>
	) {
		// GraphNodeDto
		return this.findAndCount(
			{ $and: [{ kind: { __graph: graphId, type: NodeKindType.EDGE } }, where] },
			params,
			options
		) as Promise<
			FindResultsDto<EntityLoaded<DtoToEntity<GraphNodeDto & Pick<NodeEntity, "toJSON">>, P>>
		>;
	}

	public override async create<P extends EntitiesToPopulate<NodeEntity>>(
		toCreate: NodeCreateDto,
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
