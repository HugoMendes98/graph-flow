import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/mapped-types";

import { GraphNodeDto } from "./graph-node.dto";
import { ENTITY_BASE_KEYS } from "../../_lib/entity";

/**
 * The mandatory keys to create a [graph-node]{@link GraphNodeDto}.
 */
export const GRAPH_NODE_KEYS_MANDATORY = ["__node", "position"] as const satisfies ReadonlyArray<
	keyof GraphNodeDto
>;

/**
 * The keys that can not be updated to a [graph-node]{@link GraphNodeDto}.
 */
export const GRAPH_NODE_KEYS_READONLY = [
	"__graph",
	"graph",
	"node",
	"inputs",
	"outputs"
] as const satisfies ReadonlyArray<keyof GraphNodeDto>;

/**
 * DTO used to create [graph-nodes]{@link GraphNodeDto}.
 */
export class GraphNodeCreateDto extends IntersectionType(
	PickType(GraphNodeDto, GRAPH_NODE_KEYS_MANDATORY),
	PartialType(
		OmitType(GraphNodeDto, [
			...ENTITY_BASE_KEYS,
			...GRAPH_NODE_KEYS_MANDATORY,
			...GRAPH_NODE_KEYS_READONLY
		])
	)
) {}
