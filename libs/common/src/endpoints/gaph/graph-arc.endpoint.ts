import { Jsonify } from "type-fest";

import { GRAPHS_ENDPOINT_PREFIX } from "./graph.endpoint";
import { EntityId } from "../../dtos/_lib/entity";
import { DtoToEntity } from "../../dtos/_lib/entity/entity.types";
import { GraphArcCreateDto, GraphArcDto, GraphArcUpdateDto } from "../../dtos/graph/arc";
import { EntityEndpoint } from "../_lib";

/**
 * Endpoint path parts for [arcs]{@link GraphArcDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const GRAPH_ARCS_ENDPOINT_PARTS = [GRAPHS_ENDPOINT_PREFIX, "/arcs"] as const;

/**
 * @param graphId the of the graph
 * @returns The endpoint prefix with the given graphId
 */
export function generateGraphArcsEndpoint(graphId: EntityId) {
	const [start, end] = GRAPH_ARCS_ENDPOINT_PARTS;
	return `${start}/${graphId}${end}`;
}

export type GraphArc = Jsonify<GraphArcDto>;
export type GraphArcEndpoint<T extends DtoToEntity<GraphArcDto> | GraphArc> = EntityEndpoint<
	T,
	GraphArcCreateDto,
	GraphArcUpdateDto
>;
