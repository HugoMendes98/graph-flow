import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType
} from "@nestjs/mapped-types";
import { IsDefined } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { NodeIoValue } from "../../io";
import { NODE_KIND_DISCRIMINATOR_KEY } from "../kind";

/**
 * Behavior of a node that is a `node-variable`
 */
export class NodeBehaviorVariableDto extends NodeBehaviorBaseDto<NodeBehaviorType.VARIABLE> {
	// TODO: this is temporary
	@DtoProperty()
	@IsDefined()
	public value!: NodeIoValue;
}

/**
 * Class to update a `node-behavior` of `variable` type
 */
export class NodeBehaviorVariableUpdateDto extends IntersectionType(
	PickType(NodeBehaviorVariableDto, [NODE_KIND_DISCRIMINATOR_KEY]),
	PartialType(
		OmitType(NodeBehaviorVariableDto, [NODE_KIND_DISCRIMINATOR_KEY])
	)
) {}
