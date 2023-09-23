import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

/**
 * Behavior of a node that is an output parameter of `node-function`
 */
export class NodeBehaviorParameterOutputDto extends NodeBehaviorBaseDto<NodeBehaviorType.PARAMETER_OUT> {
	/**
	 * Foreign key to the node-output
	 */
	@DtoProperty()
	public readonly __node_output!: number;
}
