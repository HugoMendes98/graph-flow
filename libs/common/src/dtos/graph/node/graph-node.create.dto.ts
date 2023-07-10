import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { GraphNodeDto } from "./graph-node.dto";
import { ENTITY_BASE_KEYS } from "../../_lib/entity";

/**
 * The mandatory keys to create a [graph-node]{@link GraphNodeDto}.
 */
export const GRAPH_NODE_KEYS_MANDATORY = [
	"__graph",
	"__node",
	"position"
] as const satisfies ReadonlyArray<keyof GraphNodeDto>;

/**
 * DTO used to create [graph-nodes]{@link GraphNodeDto}.
 */
export class GraphNodeCreateDto extends IntersectionType(
	PickType(GraphNodeDto, GRAPH_NODE_KEYS_MANDATORY),
	OmitType(GraphNodeDto, [...ENTITY_BASE_KEYS, ...GRAPH_NODE_KEYS_MANDATORY])
) {}
