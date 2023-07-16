import { Jsonify } from "type-fest";

import { GraphNodeCreateDto, GraphNodeDto, GraphNodeUpdateDto } from "../../dtos/graph/node";
import { EntityEndpoint } from "../_lib";

/**
 * Endpoint path for [nodes]{@link GraphNodeDto} (without global prefix).
 */
export const GRAPH_NODES_ENDPOINT_PREFIX = "/v1/graph-nodes";

export type GraphNode = Jsonify<GraphNodeDto>;
export type GraphNodeEndpoint<Serialized extends boolean = false> = EntityEndpoint<
	Serialized extends true ? GraphNode : GraphNodeDto,
	GraphNodeCreateDto,
	GraphNodeUpdateDto
>;
