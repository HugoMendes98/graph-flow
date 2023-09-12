import { IsDefined } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { NodeIoValue } from "../../io";

/**
 * Base behavior of node that is a variable/parameter
 */
export abstract class NodeBehaviorParameterBaseDto extends NodeBehaviorBaseDto {
	/**
	 * @inheritDoc
	 */
	public abstract override readonly type:
		| NodeBehaviorType.PARAMETER_IN
		| NodeBehaviorType.PARAMETER_OUT
		| NodeBehaviorType.VARIABLE;
}

/**
 * Behavior of a node that is a `node-variable`
 */
export class NodeBehaviorVariableDto extends NodeBehaviorParameterBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeBehaviorType.VARIABLE;

	// TODO: this is temporary
	@DtoProperty()
	@IsDefined()
	public value!: NodeIoValue;
}

/**
 * Behavior of a node that is an input parameter of `node-function`
 */
export class NodeBehaviorParameterInputDto extends NodeBehaviorParameterBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeBehaviorType.PARAMETER_IN;

	/**
	 * Foreign key to the node-input
	 */
	@DtoProperty()
	public readonly __node_input!: number;
}

/**
 * Behavior of a node that is an output parameter of `node-function`
 */
export class NodeBehaviorParameterOutputDto extends NodeBehaviorParameterBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeBehaviorType.PARAMETER_OUT;

	/**
	 * Foreign key to the node-output
	 */
	@DtoProperty()
	public readonly __node_output!: number;
}
