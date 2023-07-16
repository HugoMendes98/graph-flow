import { Jsonify } from "type-fest";

import { GraphArcCreateDto, GraphArcDto, GraphArcUpdateDto } from "../../dtos/graph/arc";
import { EntityEndpoint } from "../_lib";

/**
 * Endpoint path for [nodes]{@link GraphNodeDto} (without global prefix).
 */
export const GRAPH_ARCS_ENDPOINT_PREFIX = "/v1/graph-arcs";

export type GraphArc = Jsonify<GraphArcDto>;
export type GraphArcEndpoint<Serialized extends boolean = false> = Omit<
	EntityEndpoint<
		Serialized extends true ? GraphArc : GraphArcDto,
		GraphArcCreateDto,
		GraphArcUpdateDto
	>,
	"update"
>;
