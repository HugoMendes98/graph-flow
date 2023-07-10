import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorFunctionDto extends NodeBehaviorBaseDto {
	public override readonly type = NodeBehaviorType.FUNCTION;

	// TODO: input/output, graph (same thing as for a workflow)
}
