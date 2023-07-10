import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorVariableDto extends NodeBehaviorBaseDto {
	public override readonly type = NodeBehaviorType.VARIABLE;

	// TODO: default value, lock type (string, number, null)
}
