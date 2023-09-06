import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { GraphArcDto } from "./graph-arc.dto";
import { ENTITY_BASE_KEYS } from "../../../../dtos/entity";

/**
 * The mandatory keys to create a [graph-arcs]{@link GraphArcDto}.
 */
export const GRAPH_ARC_KEYS_MANDATORY = [] as const satisfies ReadonlyArray<keyof GraphArcDto>;

/**
 * The readonly keys of a [graph-arcs]{@link GraphArcDto}.
 */
export const GRAPH_ARC_KEYS_READONLY = ["from", "to"] as const satisfies ReadonlyArray<
	keyof GraphArcDto
>;

/**
 * DTO used to create [graph-arcs]{@link GraphArcDto}.
 */
export class GraphArcCreateDto extends IntersectionType(
	PickType(GraphArcDto, GRAPH_ARC_KEYS_MANDATORY),
	OmitType(GraphArcDto, [
		...ENTITY_BASE_KEYS,
		...GRAPH_ARC_KEYS_MANDATORY,
		...GRAPH_ARC_KEYS_READONLY
	])
) {}
