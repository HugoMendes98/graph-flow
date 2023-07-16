import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { GraphArcDto } from "./graph-arc.dto";
import { ENTITY_BASE_KEYS } from "../../_lib/entity";

/**
 * The mandatory keys to create a [graph-arcs]{@link GraphArcDto}.
 */
export const GRAPH_ARC_KEYS_MANDATORY = [] as const satisfies ReadonlyArray<keyof GraphArcDto>;

/**
 * DTO used to create [graph-arcs]{@link GraphArcDto}.
 */
export class GraphArcCreateDto extends IntersectionType(
	PickType(GraphArcDto, GRAPH_ARC_KEYS_MANDATORY),
	OmitType(GraphArcDto, [...ENTITY_BASE_KEYS, ...GRAPH_ARC_KEYS_MANDATORY])
) {}
