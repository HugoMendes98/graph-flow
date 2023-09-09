import { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { EntityName } from "@mikro-orm/nestjs";
import {
	forwardRef,
	Injectable,
	MethodNotAllowedException,
	NotImplementedException,
	Inject
} from "@nestjs/common";
import { graphHasCycle } from "~/lib/common/app/graph/algorithms";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { getAdjacencyList } from "~/lib/common/app/graph/transformations";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphArcDifferentGraphException } from "./exceptions";
import { GraphArc } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService } from "../../_lib/entity";
import { NodeService } from "../../node/node.service";
import { GraphCyclicException } from "../exceptions";

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
	 * @param nodeService injected
	 */
	public constructor(
		repository: GraphArcRepository,
		@Inject(forwardRef(() => NodeService)) private readonly nodeService: NodeService
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
		const { data: arcs } = await this.findAndCount({
			$or: [
				{ from: { node: { kind: { __graph } } } },
				{ to: { node: { kind: { __graph } } } }
			]
		});
		const { data: nodes } = await this.nodeService.findAndCount({ kind: { __graph } });

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
