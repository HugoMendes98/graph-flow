import { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphArcDifferentGraphException } from "./exceptions";
import { GraphArc } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService } from "../../_lib/entity";
import { GraphNodeService } from "../node/graph-node.service";

/**
 * Service to manages [graph-arcs]{@link GraphArc}.
 */
@Injectable()
export class GraphArcService
	extends EntityService<GraphArc, GraphArcCreateDto, Record<string, never>>
	implements EventSubscriber<GraphArc>
{
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

		const { data: nodes } = await this.graphNodeService.findAndCount(
			{ $or: [{ inputs: { _id: __to } }, { outputs: { _id: __from } }] },
			{ limit: 2 }
		);

		// No need to test if:
		// - length === 0 -> Error will be thrown due to unknown id (FK constraint)
		// - length === 1 -> Same node, cyclic graph is tested bellow
		if (nodes.length === 2) {
			const [nodeA, nodeB] = nodes;
			if (nodeA.__graph !== nodeB.__graph) {
				throw new GraphArcDifferentGraphException(__from, __to);
			}
		}

		// TODO: test if it creates a cycle in the graph
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
