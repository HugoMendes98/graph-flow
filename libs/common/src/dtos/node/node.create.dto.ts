import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { NodeDto } from "./node.dto";
import { ENTITY_BASE_KEYS } from "../_lib/entity";

/**
 * The mandatory keys to create a [node]{@link NodeDto}.
 */
export const NODE_CREATE_KEYS_MANDATORY = ["name"] as const satisfies ReadonlyArray<
	keyof NodeDto
>;

/**
 * DTO used to create [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeCreateDto extends IntersectionType(
	PickType(NodeDto, NODE_CREATE_KEYS_MANDATORY),
	OmitType(NodeDto, [...ENTITY_BASE_KEYS, ...NODE_CREATE_KEYS_MANDATORY])
) {}
