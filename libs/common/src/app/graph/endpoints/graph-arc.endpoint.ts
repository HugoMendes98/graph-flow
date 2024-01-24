import { Jsonify } from "type-fest";

import { GRAPHS_ENDPOINT_PREFIX } from "./graph.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { GraphArcCreateDto, GraphArcDto, GraphArcUpdateDto } from "../dtos/arc";

/**
 * Endpoint path parts for [arcs]{@link GraphArcDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const GRAPH_ARCS_ENDPOINT_PARTS = [
	GRAPHS_ENDPOINT_PREFIX,
	"/arcs"
] as const;

/**
 * Generates the endpoint for `graph-arc`s for a graph.
 *
 * @param graphId the of the graph
 * @returns The endpoint prefix with the given graphId
 */
export function generateGraphArcsEndpoint(graphId: EntityId) {
	const [start, end] = GRAPH_ARCS_ENDPOINT_PARTS;
	return `${start}/${graphId}${end}`;
}

export type GraphArcJSON = Jsonify<GraphArcDto>;
export type GraphArcEndpoint<
	T extends DtoToEntity<GraphArcDto> | GraphArcJSON = GraphArcJSON
> = EntityEndpoint<T, GraphArcCreateDto, GraphArcUpdateDto>;
