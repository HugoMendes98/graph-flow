import { Jsonify } from "type-fest";

import { GRAPHS_ENDPOINT_PREFIX } from "./graph.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { GraphNodeCreateDto, GraphNodeDto, GraphNodeUpdateDto } from "../dtos/node";

/**
 * Endpoint path parts for [nodes]{@link GraphNodeDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const GRAPH_NODES_ENDPOINT_PARTS = [GRAPHS_ENDPOINT_PREFIX, "/nodes"] as const;

/**
 * @param graphId the of the graph
 * @returns The endpoint prefix with the given graphId
 */
export function generateGraphNodesEndpoint(graphId: EntityId) {
	const [start, end] = GRAPH_NODES_ENDPOINT_PARTS;
	return `${start}/${graphId}${end}`;
}

export type GraphNode = Jsonify<GraphNodeDto>;
export type GraphNodeEndpoint<T extends DtoToEntity<GraphNodeDto> | GraphNode = GraphNode> =
	EntityEndpoint<T, GraphNodeCreateDto, GraphNodeUpdateDto>;
