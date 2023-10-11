import { Semaphore } from "@heap-code/concurrency-synchronization";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { breadth, depth } from "treeverse";
import { getAdjacencyList } from "~/lib/common/app/graph/transformations";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphExecutorStartingNodeException } from "./exceptions";
import { GraphExecuteNodeStartingState, GraphExecuteState } from "./graph.executor.state";
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
	 * @returns Promise when initialized that returns a finish-able observable with events
	 */
	public async execute(
		params: GraphExecuteParams,
		options: GraphExecuteOptions = {}
	): Promise<Observable<GraphExecuteState>> {
		const { graphId, inputs, startAt } = params;

		const { data: arcs } = await this.arcService.findByGraph(graphId);
		const { data: nodes } = await this.nodeService.findByGraph(graphId);

		const nodesJSON = nodes.map(node => node.toJSON());
		const nodesRoot = nodesJSON.filter(({ _id }) => startAt.includes(_id));

		if (startAt.length === 0 || nodesRoot.length !== startAt.length) {
			throw new GraphExecutorStartingNodeException();
		}

		const adjacencyList = getAdjacencyList({ arcs, nodes: nodesJSON });
		const nodesMap = new Map(nodes.map(node => [node._id, node]));

		const visited = new Set<(typeof nodesRoot)[number]>();
		const executing = new Map<EntityId, Semaphore>();

		const state$ = new Subject<GraphExecuteState>();
		const inputsLocal = new Map(inputs);

		// TODO: better (separate functions, ...)
		const execute = () =>
			// "Thread" all starting nodes
			Promise.all(
				nodesRoot
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Exist from before
					.map(node => adjacencyList.get(node)!)
					.map(root =>
						// BFS is probably better here for "parallelism"
						// Getting the next nodes to activates from starting nodes
						breadth({
							// No need to visit a node if it has been visited from another "Thread"
							filter: ({ node }) => !visited.has(node),
							getChildren: ({ adjacentTo }) =>
								Promise.resolve(adjacentTo.map(({ to }) => to)),
							tree: root,
							// Resolve dependencies and execute
							visit: adItem => {
								/**
								 * @internal
								 */
								interface BFSValue {
									/**
									 * Current BFS node
									 */
									adjacencyItem: typeof root;
									/**
									 * To run once executed
									 */
									onceDone: () => void;
								}

								visited.add(adItem.node);

								return depth({
									// No need to visit a node if it has been visited from another "Thread"
									filter: ({ node }) => !visited.has(node),
									getChildren: ({ adjacentBy }) =>
										Promise.resolve(adjacentBy.map(({ from }) => from)),
									leave: async (value: BFSValue | false) => {
										if (value === false) {
											// Nothing to do: already executed
											return value;
										}

										const {
											adjacencyItem: { adjacentTo, node },
											onceDone
										} = value;

										// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Exist from above
										const nodeEntity = nodesMap.get(node._id)!;
										const state = {
											inputs: inputsLocal,
											node: nodeEntity,
											type: "node-starting"
										} as const satisfies GraphExecuteNodeStartingState;
										state$.next(state);

										const outputs = await this.nodeExecutor.execute({
											node: nodeEntity,
											valuedInputs: inputsLocal
										});

										// Complete graph values
										const outputValues = new Map(
											outputs.map(
												({ output, value }) => [output._id, value] as const
											)
										);
										for (const { arc } of adjacentTo) {
											inputsLocal.set(
												arc.__to,
												outputValues.get(arc.__from)!
											);
										}

										state$.next({ ...state, outputs, type: "node-finish" });

										onceDone();
										return value;
									},
									tree: adItem,
									visit: async adjacencyItem => {
										const {
											node: { _id: nodeId }
										} = adjacencyItem;

										// "Threaded", so a node could have been added multiple times.
										const semaphore = executing.get(nodeId);
										if (semaphore) {
											// Wait for it to be executed
											return semaphore
												.tryAcquire(options.timeout ?? 1000 * 60 * 5)
												.then(() => false as const);
										} else {
											// This one will be executed, no the others
											const sem = new Semaphore(0);
											executing.set(nodeId, sem);

											return {
												adjacencyItem,
												onceDone: () => {
													executing.delete(nodeId);
													sem.releaseAll();
												}
											};
										}
									}
								});
							}
						})
					)
			)
				.then(() => state$.complete())
				.catch((error: unknown) => state$.error(error));

		// This is mandatory to allow subscriptions before the function starts;
		// JS will wait for an "open time", to run the function in the `setTimeout`
		setTimeout(() => void execute(), 0);
		return state$.asObservable();
	}
}
