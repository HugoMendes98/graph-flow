import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType
} from "@nestjs/mapped-types";
import { ValidateNested } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import {
	NodeTriggerBaseDto,
	NodeTriggerDiscriminatorKey,
	NODE_TRIGGER_DTOS,
	NodeTriggerDto
} from "./triggers";
import { DtoProperty } from "../../../../dtos/dto";
import { NODE_KIND_DISCRIMINATOR_KEY } from "../kind";

/**
 * Behavior of a node that is a trigger
 */
export class NodeBehaviorTriggerDto extends NodeBehaviorBaseDto<NodeBehaviorType.TRIGGER> {
	/**
	 * The trigger behavior of the node
	 */
	@DtoProperty({
		discriminator: {
			property: "type" satisfies NodeTriggerDiscriminatorKey,
			subTypes: NODE_TRIGGER_DTOS.slice()
		},
		type: () => NodeTriggerBaseDto
	})
	@ValidateNested()
	public readonly trigger!: NodeTriggerDto;

	// TODO ?
}

/**
 * Class to update a `node-behavior` of `trigger` type
 */
export class NodeBehaviorTriggerUpdateDto extends IntersectionType(
	PickType(NodeBehaviorTriggerDto, [NODE_KIND_DISCRIMINATOR_KEY]),
	PartialType(OmitType(NodeBehaviorTriggerDto, [NODE_KIND_DISCRIMINATOR_KEY]))
) {}
