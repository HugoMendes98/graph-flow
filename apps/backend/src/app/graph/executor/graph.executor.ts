import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { getAdjacencyList } from "~/lib/common/app/graph/transformations";
import { NodeDto } from "~/lib/common/app/node/dtos";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphExecutorStartingNodeException } from "./exceptions";
import { GraphExecuteState } from "./graph.executor.state";
import { GraphResolver, GraphResolverNode } from "./graph.resolver";
import { NodeExecutor, NodeInputAndValues } from "../../node/executor/node.executor";
import { NodeService } from "../../node/node.service";
import { GraphArcService } from "../arc/graph-arc.service";

/**
 * Parameters when executing a `graph`
 */
export interface GraphExecuteParams {
	/**
	 * Id of the graph to execute
	 */
	graphId: EntityId;
	/**
	 * Some initial values for the starting nodes
	 */
	inputs?: NodeInputAndValues;
	/**
	 * Ids of the nodes where to start the resolving
	 */
	startAt: EntityId[];
}
/**
 * Options when executing a `graph`
 */
export interface GraphExecuteOptions {
	/**
	 * Timeout in ms for **1** node.
	 */
	timeout?: number;
}

/**
 * A graph executor
 */
@Injectable()
export class GraphExecutor {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param arcService injected
	 * @param nodeService injected
	 * @param nodeExecutor injected
	 */
	public constructor(
		private readonly arcService: GraphArcService,
		@Inject(forwardRef(() => NodeService))
		private readonly nodeService: NodeService,
		@Inject(forwardRef(() => NodeExecutor))
		private readonly nodeExecutor: NodeExecutor
	) {}

	/**
	 * Executes a graph
	 *
	 * @param params parameters with the graph and the starting nodes
	 * @param options additional options
	 * @returns Promise when initialized that returns a finish-able observable with events.
	 *  Note: the Observable comes from a [ReplaySubject]{@link https://rxjs.dev/guide/subject#replaysubject}
	 */
	public async execute(
		params: GraphExecuteParams,
		options: GraphExecuteOptions = {}
	): Promise<Observable<GraphExecuteState>> {
		const { graphId, inputs, startAt } = params;

		const { data: arcs } = await this.arcService.findByGraph(graphId);
		const nodes = await this.nodeService.findByGraph(graphId).then(({ data }) =>
			data.map<GraphResolverNode>(node => ({
				...(node.toJSON() as NodeDto),
				entity: node
			}))
		);

		const roots = nodes.filter(({ _id }) => startAt.includes(_id));
		if (startAt.length === 0 || roots.length !== startAt.length) {
			throw new GraphExecutorStartingNodeException();
		}

		const adjacencyList = getAdjacencyList({ arcs, nodes });
		const resolver = new GraphResolver(
			this.nodeExecutor,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Known elements
			roots.map(root => adjacencyList.get(root)!),
			inputs ?? new Map(),
			options
		);

		void resolver.execute();
		return resolver.state$;
	}
}
