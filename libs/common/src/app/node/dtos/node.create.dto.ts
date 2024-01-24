import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";
import { Expose, Type as TypeTransformer } from "class-transformer";
import { ValidateNested } from "class-validator";

import {
	NODE_BEHAVIOR_CREATE_DTOS,
	NODE_BEHAVIOR_DISCRIMINATOR_KEY,
	NodeBehaviorBaseDto,
	NodeBehaviorCreateDto
} from "./behaviors";
import { NodeDto } from "./node.dto";
import { ENTITY_BASE_KEYS } from "../../../dtos/entity";

/**
 * The mandatory keys to create a [node]{@link NodeDto}.
 */
export const NODE_CREATE_KEYS_MANDATORY = [
	"kind",
	"name"
] as const satisfies ReadonlyArray<keyof NodeDto>;

/**
 * DTO used to create [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeCreateDto extends IntersectionType(
	PickType(NodeDto, NODE_CREATE_KEYS_MANDATORY),
	OmitType(NodeDto, [
		...ENTITY_BASE_KEYS,
		...NODE_CREATE_KEYS_MANDATORY,
		"behavior",
		"categories",
		"inputs",
		"outputs"
	])
) {
	/**
	 * Parameters can only be created when adding them to a node-function graph
	 */
	@Expose()
	@TypeTransformer(() => NodeBehaviorBaseDto, {
		discriminator: {
			property: NODE_BEHAVIOR_DISCRIMINATOR_KEY,
			subTypes: NODE_BEHAVIOR_CREATE_DTOS.slice()
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly behavior!: NodeBehaviorCreateDto;
}
