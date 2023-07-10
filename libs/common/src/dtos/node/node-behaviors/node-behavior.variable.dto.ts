import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorVariableDto extends NodeBehaviorBase {
	public readonly type = NodeBehaviorType.VARIABLE;

	// TODO: default value, lock type (string, number, null)
}
