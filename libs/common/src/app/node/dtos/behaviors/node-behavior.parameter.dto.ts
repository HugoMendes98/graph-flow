import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

export abstract class NodeBehaviorParameterBaseDto extends NodeBehaviorBaseDto {
	public abstract override readonly type:
		| NodeBehaviorType.PARAMETER_IN
		| NodeBehaviorType.PARAMETER_OUT
		| NodeBehaviorType.VARIABLE;

	// TODO: default value, lock type (string, number, null)
}

export class NodeBehaviorVariableDto extends NodeBehaviorParameterBaseDto {
	public override readonly type = NodeBehaviorType.VARIABLE;
}

export class NodeBehaviorParameterInputDto extends NodeBehaviorParameterBaseDto {
	public override readonly type = NodeBehaviorType.PARAMETER_IN;

	/**
	 * Foreign key to the node-input
	 */
	@DtoProperty()
	public readonly __node_input!: number;
}

export class NodeBehaviorParameterOutputDto extends NodeBehaviorParameterBaseDto {
	public override readonly type = NodeBehaviorType.PARAMETER_OUT;

	/**
	 * Foreign key to the node-output
	 */
	@DtoProperty()
	public readonly __node_output!: number;
}
