import { GraphArc } from "./arc/graph-arc.entity";
import { Graph } from "./graph.entity";
import { GraphNode } from "./node/graph-node.entity";
import { GraphNodeInput } from "./node/input";
import { GraphNodeOutput } from "./node/output";

/**
 * All entities to manage {@link Graph}
 */
export const GRAPH_ENTITIES = [Graph, GraphArc, GraphNode, GraphNodeInput, GraphNodeOutput];
