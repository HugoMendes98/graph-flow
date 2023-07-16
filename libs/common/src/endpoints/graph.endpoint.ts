import { Jsonify } from "type-fest";

import { EntityReadEndpoint } from "./_lib";
import { GraphDto } from "../dtos/graph";

/**
 * Endpoint path for [graphs]{@link GraphDto} (without global prefix).
 */
export const NODES_ENDPOINT_PREFIX = "/v1/nodes";

export type Graph = Jsonify<GraphDto>;
export type GraphEndpoint<Serialized extends boolean = false> = EntityReadEndpoint<
	Serialized extends true ? Graph : GraphDto
>;
