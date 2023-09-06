import { depth } from "treeverse";

import { AdjacencyList, AdjacencyListNode } from "../transformations";

/**
 * To easily stop the algorithm once a cycle is detected
 *
 * @internal
 */
class CycleException extends Error {}

/**
 * Detects if the given graph has a cycle.
 *
 * The cycle is determined by the explored nodes.
 *
 * @param graph the graph by its adjacency list
 * @throws an exception when the given data is incoherent
 * @returns true if the graphs contains at least one cycle
 */
export function graphHasCycle(graph: AdjacencyList): boolean {
	if (graph.size === 0) {
		return false;
	}

	// The roots to visit (nodes starting a traversal).
	// It will be decreased once a node is visited.
	const roots = new Set(graph.keys());

	try {
		for (const root of roots) {
			// The current visited nodes, used to detect a cycle
			const path = new Set<AdjacencyListNode>();

			depth({
				// No need to process a node that is no longer in the root list
				filter: node => roots.has(node),
				getChildren: node => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Will thrown an error if the data is invalid
					const children = graph.get(node)!.adjacentTo.map(({ to: { node } }) => node);

					for (const child of children) {
						// The node has already been visited, there's a cycle
						if (path.has(child)) {
							// "Kill" the traversal
							throw new CycleException();
						}
					}

					// The algorithm filters the already visited nodes
					return children;
				},
				leave: (node: AdjacencyListNode) => {
					// No longer on the path
					path.delete(node);
					return node;
				},
				tree: root,
				visit: node => {
					// There no need to start the traversal from this node
					roots.delete(node);
					// The node is being visited in the current traversal
					path.add(node);

					return node;
				}
			});
		}
	} catch (exception: unknown) {
		if (exception instanceof CycleException) {
			return true;
		}

		throw exception;
	}

	return false;
}
