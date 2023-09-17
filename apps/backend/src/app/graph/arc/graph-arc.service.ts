import { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import {
	forwardRef,
	Inject,
	Injectable,
	MethodNotAllowedException,
	NotImplementedException
} from "@nestjs/common";
import { graphHasCycle } from "~/lib/common/app/graph/algorithms";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { getAdjacencyList } from "~/lib/common/app/graph/transformations";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind";
import { EntityId } from "~/lib/common/dtos/entity";
import { EntitiesToPopulate, EntityFilter, EntityFindParams } from "~/lib/common/endpoints";

import { GraphArcDifferentGraphException } from "./exceptions";
import { GraphArcEntity } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService, EntityServiceFindOptions } from "../../_lib/entity";
import { NodeService } from "../../node/node.service";
import { GraphCyclicException } from "../exceptions";

/**
 * Service to manages [graph-arcs]{@link GraphArcEntity}.
 */
@Injectable()
export class GraphArcService
	extends EntityService<GraphArcEntity, GraphArcCreateDto, Record<string, never>>
	implements EventSubscriber<GraphArcEntity>
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 * @param nodeService injected
	 */
	public constructor(
		repository: GraphArcRepository,
		@Inject(forwardRef(() => NodeService)) private readonly nodeService: NodeService
	) {
		super(repository);

		repository.getEntityManager().getEventManager().registerSubscriber(this);
	}

	/** @inheritDoc */
	public getSubscribedEntities(): Array<EntityName<GraphArcEntity>> {
		return [GraphArcEntity];
	}

	/** @inheritDoc */
	public async beforeCreate(event: EventArgs<GraphArcEntity>) {
		const {
			entity: { __from, __to }
		} = event;

		const {
			data: [nodeA],
			pagination: { total: totalA }
		} = await this.nodeService.findAndCount({ inputs: { _id: __to } }, { limit: 1 });
		const {
			data: [nodeB],
			pagination: { total: totalB }
		} = await this.nodeService.findAndCount({ outputs: { _id: __from } }, { limit: 1 });

		if (totalA + totalB <= 1) {
			// Let the FK error be triggered
			return;
		}

		const { kind: nodeAKind } = nodeA;
		const { kind: nodeBKind } = nodeB;

		if (nodeAKind.type !== NodeKindType.EDGE || nodeBKind.type !== NodeKindType.EDGE) {
			throw new NotImplementedException();
		}

		if (nodeAKind.__graph !== nodeBKind.__graph) {
			throw new GraphArcDifferentGraphException(__from, __to);
		}

		// Load graph content
		const { __graph } = nodeAKind;
		const { data: arcs } = await this.findByGraph(__graph);
		const { data: nodes } = await this.nodeService.findByGraph(__graph);

		const adjacencyList = getAdjacencyList({
			arcs: [{ __from, __to }, ...arcs],
			nodes: nodes.map(node => node.toJSON())
		});

		if (graphHasCycle(adjacencyList)) {
			throw new GraphCyclicException();
		}
	}

	/**
	 * Finds arcs related to a graph
	 *
	 * @see EntityService
	 * @param graphId The graph id to look for
	 * @param where Filter to apply
	 * @param params Additional parameters to sort and/or paginate
	 * @param options Some options when loading an entities
	 * @returns All arcs from a graph
	 */
	public findByGraph<P extends EntitiesToPopulate<GraphArcEntity>>(
		graphId: EntityId,
		where: EntityFilter<GraphArcEntity> = {},
		params: EntityFindParams<GraphArcEntity> = {},
		options?: EntityServiceFindOptions<GraphArcEntity, P>
	) {
		return this.findAndCount<P>(
			{
				$and: [where],
				$or: [
					{ from: { node: { kind: { __graph: graphId, type: NodeKindType.EDGE } } } },
					{ to: { node: { kind: { __graph: graphId, type: NodeKindType.EDGE } } } }
				]
			},
			params,
			options
		);
	}

	/**
	 * Can not update an arc.
	 *
	 * @param _id ignored
	 * @param _toUpdate ignored
	 * @returns a Promise that rejects
	 */
	public override update(_id: EntityId, _toUpdate: Record<string, never>) {
		return Promise.reject(new MethodNotAllowedException("An arc can not be updated"));
	}
}
