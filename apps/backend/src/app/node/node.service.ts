import { EventArgs, EventSubscriber, Reference } from "@mikro-orm/core";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GraphNodeDto } from "~/lib/common/app/graph/dtos/node";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import {
	NodeBehaviorParameterInputCreateDto,
	NodeBehaviorParameterOutputCreateDto
} from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import {
	EntitiesToPopulate,
	EntityFilter,
	EntityFindParams
} from "~/lib/common/endpoints";

import {
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput
} from "./behaviors";
import {
	NodeNoTemplateParameterException,
	NodeReadonlyKindTypeException
} from "./exceptions";
import { NodeInputEntity } from "./input/node-input.entity";
import { NodeInputCreate } from "./input/node-input.types";
import { NODE_KIND_ENTITIES, NodeKindEntity } from "./kind";
import { NodeEntity } from "./node.entity";
import { NodeRepository } from "./node.repository";
import { NodeOutputEntity } from "./output/node-output.entity";
import { NodeOutputCreate } from "./output/node-output.types";
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
export type NodeCreateEntity = NodeCreateDto;

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

			beforeUpdate(
				args: EventArgs<NodeKindEntity>
			): Promise<void> | void {
				const { changeSet } = args;
				if (!changeSet) {
					return;
				}

				const { entity, originalEntity } = changeSet;
				if (
					!originalEntity?.type ||
					originalEntity.type !== entity.type
				) {
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

		if (
			kind.type === NodeKindType.TEMPLATE &&
			(behavior.type === NodeBehaviorType.PARAMETER_IN ||
				behavior.type === NodeBehaviorType.PARAMETER_OUT)
		) {
			throw new NodeNoTemplateParameterException();
		}

		if (
			behavior.type !== NodeBehaviorType.TRIGGER ||
			kind.type !== NodeKindType.VERTEX
		) {
			// Nothing to verify it the node is not a `trigger`
			return;
		}

		// TODO: A way to add custom relation in the EntityRelationsKey?
		const behaviorRelation: keyof GraphEntity = "nodeBehavior";
		const { nodeBehavior, workflow } = await this.graphService.findById(
			kind.__graph,
			{
				populate: { [behaviorRelation]: true, workflow: true }
			}
		);

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
					kind: { __graph: kind.__graph, type: NodeKindType.VERTEX }
				},
				{ limit: 0 }
			);

			if (0 < total) {
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
			{
				$and: [
					{ kind: { __graph: graphId, type: NodeKindType.VERTEX } },
					where
				]
			},
			params,
			options
		) as Promise<
			FindResultsDto<
				EntityLoaded<
					DtoToEntity<GraphNodeDto & Pick<NodeEntity, "toJSON">>,
					P
				>
			>
		>;
	}

	/** @inheritDoc */
	public override async create<P extends EntitiesToPopulate<NodeEntity>>(
		toCreate: NodeCreateEntity,
		options?: EntityServiceCreateOptions<NodeEntity, P>
	): Promise<EntityLoaded<NodeEntity, P>> {
		return super
			.create(await this.transformBeforeCreate(toCreate), options)
			.then(async created => {
				const inputs = await this.getInputsOnCreation(created);
				const outputs = await this.getOutputsOnCreation(created);

				const em = this.repository.getEntityManager();
				for (const input of inputs) {
					em.create(NodeInputEntity, {
						...input,
						__node: created._id
					} satisfies NodeInputCreate as never);
				}
				for (const output of outputs) {
					em.create(NodeOutputEntity, {
						...output,
						__node: created._id
					} satisfies NodeOutputCreate as never);
				}

				if (0 < outputs.length + inputs.length) {
					await em.flush();

					// "Refresh" relations
					await created.inputs.init();
					await created.outputs.init();
				}

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
		return this.findById(nodeId, { populate: { categories: true } }).then(
			async node => {
				node.categories.add(
					Reference.createFromPK(CategoryEntity, categoryId)
				);

				await this.repository.getEntityManager().persistAndFlush(node);
				return node;
			}
		);
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
		return this.findById(nodeId, { populate: { categories: true } }).then(
			async node => {
				const categories = await node.categories.matching({
					where: { _id: { $eq: categoryId } }
				});

				if (categories.length === 0) {
					return node;
				}

				node.categories.remove(categories[0]);

				await this.repository.getEntityManager().persistAndFlush(node);
				return node;
			}
		);
	}

	/**
	 * Determines the inputs that must be set on a node-behavior creation.
	 *
	 * @param node just created
	 * @returns the inputs that should be created
	 */
	private async getInputsOnCreation(
		node: NodeEntity
	): Promise<Array<Omit<NodeInputCreate, "__node">>> {
		const { behavior } = node;
		switch (behavior.type) {
			case NodeBehaviorType.REFERENCE: {
				const { inputs } = await this.findById(behavior.__node);
				return inputs.getItems().map(({ _id, name, type }) => ({
					__ref: _id,
					name: `*${name}`,
					type
				}));
			}

			case NodeBehaviorType.PARAMETER_OUT:
				return [{ __ref: null, name: "", type: NodeIoType.ANY }];
			case NodeBehaviorType.VARIABLE:
				return [{ __ref: null, name: "", type: NodeIoType.VOID }];

			// No inputs by default
			case NodeBehaviorType.CODE:
			case NodeBehaviorType.FUNCTION:
			case NodeBehaviorType.PARAMETER_IN:
			case NodeBehaviorType.TRIGGER:
				return [];
		}
	}

	/**
	 * Determines the outputs that must be set on a node-behavior creation.
	 *
	 * @param node just created
	 * @returns the outputs that should be created
	 */
	private async getOutputsOnCreation(
		node: NodeEntity
	): Promise<Array<Omit<NodeOutputCreate, "__node">>> {
		const { behavior } = node;
		switch (behavior.type) {
			case NodeBehaviorType.REFERENCE: {
				const { outputs } = await this.findById(behavior.__node);
				return outputs.getItems().map(({ _id, name, type }) => ({
					__ref: _id,
					name: `*${name}`,
					type
				}));
			}

			case NodeBehaviorType.TRIGGER:
				return [{ __ref: null, name: "", type: NodeIoType.NUMBER }];

			case NodeBehaviorType.CODE:
			case NodeBehaviorType.PARAMETER_IN:
			case NodeBehaviorType.VARIABLE:
				return [{ __ref: null, name: "", type: NodeIoType.ANY }];

			case NodeBehaviorType.FUNCTION: // No inputs by default
			case NodeBehaviorType.PARAMETER_OUT:
				return [];
		}
	}

	/**
	 * Transforms the value to be inserted
	 *
	 * @param toCreate the initial value
	 * @returns the transformed (when needed) data
	 */
	private async transformBeforeCreate(
		toCreate: NodeCreateEntity
	): Promise<NodeCreateEntity> {
		const { behavior, kind } = toCreate;

		if (
			kind.type === NodeKindType.VERTEX &&
			(behavior.type === NodeBehaviorType.PARAMETER_IN ||
				behavior.type === NodeBehaviorType.PARAMETER_OUT)
		) {
			// This will create empty entities, so the ORM create the missing relation during the transaction.
			// Linked to the repository create function
			const { data } = await this.findAndCount({
				behavior: {
					__graph: kind.__graph,
					type: NodeBehaviorType.FUNCTION
				}
			});
			if (data[0]?.behavior.type !== NodeBehaviorType.FUNCTION) {
				// Let the other validation throw the error
				return toCreate;
			}

			const em = this.repository.getEntityManager();
			const [nodeFn] = data;
			const ioToCreate: NodeInputCreate | NodeOutputCreate = {
				__node: nodeFn._id,
				__ref: null,
				name: "",
				type: NodeIoType.ANY
			};

			const updatedBehavior =
				behavior.type === NodeBehaviorType.PARAMETER_IN
					? ({
							...behavior,
							nodeInput: em.create(
								NodeInputEntity,
								ioToCreate as NodeInputEntity
							)
						} satisfies NodeBehaviorParameterInputCreateDto &
							Pick<NodeBehaviorParameterInput, "nodeInput">)
					: ({
							...behavior,
							nodeOutput: em.create(
								NodeOutputEntity,
								ioToCreate as NodeOutputEntity
							)
						} satisfies NodeBehaviorParameterOutputCreateDto &
							Pick<NodeBehaviorParameterOutput, "nodeOutput">);

			return {
				...toCreate,
				behavior: updatedBehavior as never
			};
		}

		return toCreate;
	}
}
