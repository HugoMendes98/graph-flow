import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

/**
 * Behavior of a node that is an input parameter of `node-function`
 */
export class NodeBehaviorParameterInputDto extends NodeBehaviorBaseDto<NodeBehaviorType.PARAMETER_IN> {
	/**
	 * Foreign key to the node-input
	 */
	@DtoProperty()
	public readonly __node_input!: number;
}
