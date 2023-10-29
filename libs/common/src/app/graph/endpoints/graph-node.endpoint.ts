import { Jsonify } from "type-fest";

import { GRAPHS_ENDPOINT_PREFIX } from "./graph.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { GraphNodeDto, GraphNodeUpdateDto } from "../dtos/node";
import { GraphNodeCreateDto } from "../dtos/node/graph-node.create.dto";

/**
 * Endpoint path parts for [nodes]{@link NodeDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const GRAPH_NODES_ENDPOINT_PARTS = [GRAPHS_ENDPOINT_PREFIX, "/nodes"] as const;

/**
 * Generates the endpoint for `graph-node`s for a graph.
 *
 * @param graphId the of the graph
 * @returns The endpoint prefix with the given graphId
 */
export function generateGraphNodesEndpoint(graphId: EntityId) {
	const [start, end] = GRAPH_NODES_ENDPOINT_PARTS;
	return `${start}/${graphId}${end}`;
}

export type GraphNodeJSON = Jsonify<GraphNodeDto>;
export type GraphNodeEndpoint<T extends DtoToEntity<GraphNodeDto> | GraphNodeJSON = GraphNodeJSON> =
	EntityEndpoint<T, GraphNodeCreateDto, GraphNodeUpdateDto>;
