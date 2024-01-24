import { OmitType } from "@nestjs/mapped-types";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { EntityId } from "../../../../dtos/entity";

/**
 * Behavior of a node that is a function
 */
export class NodeBehaviorFunctionDto extends NodeBehaviorBaseDto<NodeBehaviorType.FUNCTION> {
	/**
	 * The graph used to represent this behavior
	 */
	@DtoProperty()
	public readonly __graph!: EntityId;
}

/**
 * Dto to create node of `function` behavior
 */
export class NodeBehaviorFunctionCreateDto extends OmitType(
	NodeBehaviorFunctionDto,
	["__graph"]
) {}
