import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorFunctionDto extends NodeBehaviorBase {
	public readonly type = NodeBehaviorType.FUNCTION;

	// TODO: input/output, graph (same thing as for a workflow)
}
