import { IsDefined } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { NodeIoValue } from "../../io";

/**
 * Behavior of a node that is a `node-variable`
 */
export class NodeBehaviorVariableDto extends NodeBehaviorBaseDto<NodeBehaviorType.VARIABLE> {
	// TODO: this is temporary
	@DtoProperty()
	@IsDefined()
	public value!: NodeIoValue;
}
