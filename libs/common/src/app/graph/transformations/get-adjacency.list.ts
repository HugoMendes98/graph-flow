import { AdjacencyListUnlinkedArcException } from "./get-adjacency-list.exceptions";
import { EntityId } from "../../../dtos/entity";
import { GraphArcDto } from "../dtos/arc";
import { GraphNodeDto } from "../dtos/node";

// Reduced data types, to be able to get the adjacency list even on incomplete data (on create or on update)

/**
 * The only necessary data from the {@link GraphArcDto} to get the adjacency list.
 */
export type AdjacencyListArc = Pick<GraphArcDto, "__from" | "__to">;
/**
 * The only necessary data from the {@link GraphArcDto} to get the adjacency list.
 */
export interface AdjacencyListNode {
	inputs: ReadonlyArray<Pick<GraphNodeDto["inputs"][number], "_id">>;
	outputs: ReadonlyArray<Pick<GraphNodeDto["outputs"][number], "_id">>;
}

export interface AdjacencyListTransformationParams<
	Arc extends AdjacencyListArc = AdjacencyListArc,
	Node extends AdjacencyListNode = AdjacencyListNode
> {
	/**
	 * The arcs to construct the adjacency list
	 */
	arcs: readonly Arc[];
	/**
	 * The nodes to construct the adjacency list
	 */
	nodes: readonly Node[];
}

/* eslint-disable no-use-before-define -- recursive type */
/**
 * The link between two nodes with its arc.
 *
 * Note: everything is object.
 */
export interface AdjacencyListLink<
	Arc extends AdjacencyListArc = AdjacencyListArc,
	Node extends AdjacencyListNode = AdjacencyListNode
> {
	/**
	 * The arc connecting two nodes
	 */
	arc: Arc;
	/**
	 * The source of the arc
	 */
	from: AdjacencyListItem<Arc, Node>;
	/**
	 * The target of the arc
	 */
	to: AdjacencyListItem<Arc, Node>;
}
/* eslint-enable */

/**
 * An item contains the nodes connected by and to the current node
 */
export interface AdjacencyListItem<Arc extends AdjacencyListArc, Node extends AdjacencyListNode> {
	/**
	 * The adjacency from other nodes leading to this one
	 */
	adjacentBy: ReadonlyArray<AdjacencyListLink<Arc, Node>>;
	/**
	 * The adjacency from this node leading to another
	 */
	adjacentTo: ReadonlyArray<AdjacencyListLink<Arc, Node>>;
	/**
	 * The current node
	 */
	node: Node;
}

/**
 * The final adjacency list.
 *
 * On a Map to access more simply the nodes.
 */
export type AdjacencyList<
	Arc extends AdjacencyListArc = AdjacencyListArc,
	Node extends AdjacencyListNode = AdjacencyListNode
> = ReadonlyMap<Node, AdjacencyListItem<Arc, Node>>;

/**
 * Gets the adjacency list from the arcs and the nodes of a graph
 *
 * @throws {AdjacencyListUnlinkedArcException}
 * @param params The parameters to retrieve the adjacency list
 * @returns The adjacency list in a {@link Map} form.
 */
export function getAdjacencyList<Arc extends AdjacencyListArc, Node extends AdjacencyListNode>(
	params: AdjacencyListTransformationParams<Arc, Node>
): AdjacencyList<Arc, Node> {
	const { arcs, nodes } = params;

	// TODO: If the data becomes too big, transform to a non-functional approach
	//  -> one loop and add to the `Map` objects

	// The initial "list", so all objects are already defined
	const list: ReadonlyMap<Node, AdjacencyListItem<Arc, Node>> = new Map(
		nodes.map(node => [node, { adjacentBy: [], adjacentTo: [], node }])
	);

	type AdjacencyItem = AdjacencyListItem<Arc, Node>;
	const entries = Array.from(list.entries());
	// The matrices of the inputs and outputs of node
	const inputsToNode = new Map<EntityId, AdjacencyItem>(
		entries.flatMap(([{ inputs }, item]) => inputs.map(({ _id }) => [_id, item]))
	);
	const outputsToNode = new Map<EntityId, AdjacencyItem>(
		entries.flatMap(([{ outputs }, item]) => outputs.map(({ _id }) => [_id, item]))
	);

	for (const arc of arcs) {
		const { __from, __to } = arc;
		const from = outputsToNode.get(__from);
		const to = inputsToNode.get(__to);

		if (!from || !to) {
			throw new AdjacencyListUnlinkedArcException(
				`The arc [${__from} -> ${__to}] can not the 2 nodes`
			);
		}

		const link: AdjacencyListLink<Arc, Node> = { arc, from, to };
		(from.adjacentTo as Array<AdjacencyListLink<Arc, Node>>).push(link);
		(to.adjacentBy as Array<AdjacencyListLink<Arc, Node>>).push(link);
	}

	return list;
}
