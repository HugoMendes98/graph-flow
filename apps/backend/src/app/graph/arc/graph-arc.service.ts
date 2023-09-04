import { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { graphHasCycle } from "~/lib/common/app/graph/algorithms";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { getAdjacencyList } from "~/lib/common/app/graph/transformations";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphArcDifferentGraphException } from "./exceptions";
import { GraphArc } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService } from "../../_lib/entity";
import { GraphCyclicException } from "../exceptions";
import { GraphNodeService } from "../node/graph-node.service";

/**
 * Service to manages [graph-arcs]{@link GraphArc}.
 */
@Injectable()
export class GraphArcService
	extends EntityService<GraphArc, GraphArcCreateDto, Record<string, never>>
	implements EventSubscriber<GraphArc>
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 * @param graphNodeService injected
	 */
	public constructor(
		repository: GraphArcRepository,
		private readonly graphNodeService: GraphNodeService
	) {
		super(repository);

		repository.getEntityManager().getEventManager().registerSubscriber(this);
	}

	/**
	 * @inheritDoc
	 */
	public getSubscribedEntities(): Array<EntityName<GraphArc>> {
		return [GraphArc];
	}

	/**
	 * @inheritDoc
	 */
	public async beforeCreate(event: EventArgs<GraphArc>) {
		const {
			entity: { __from, __to }
		} = event;

		const {
			data: [nodeA],
			pagination: { total: totalA }
		} = await this.graphNodeService.findAndCount({ inputs: { _id: __to } }, { limit: 1 });
		const {
			data: [nodeB],
			pagination: { total: totalB }
		} = await this.graphNodeService.findAndCount({ outputs: { _id: __from } }, { limit: 1 });

		switch ((totalA + totalB) as 0 | 1 | 2) {
			case 0:
			case 1: // One was not found
				// Let the FK error be triggered
				return;
			case 2:
				if (nodeA.__graph !== nodeB.__graph) {
					throw new GraphArcDifferentGraphException(__from, __to);
				}

				break;
		}

		// Load graph content
		const { __graph } = nodeA;
		const { data: arcs } = await this.findAndCount({
			$or: [{ from: { graphNode: { __graph } } }, { to: { graphNode: { __graph } } }]
		});
		const { data: nodes } = await this.graphNodeService.findAndCount({ __graph });

		const adjacencyList = getAdjacencyList({
			arcs: [{ __from, __to }, ...arcs],
			nodes: nodes.map(node => node.toJSON())
		});

		if (graphHasCycle(adjacencyList)) {
			throw new GraphCyclicException();
		}
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
