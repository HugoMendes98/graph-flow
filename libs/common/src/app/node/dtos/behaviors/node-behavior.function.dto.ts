import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

export class NodeBehaviorFunctionDto extends NodeBehaviorBaseDto {
	public override readonly type = NodeBehaviorType.FUNCTION;

	// TODO: input/output, graph (same thing as for a workflow)

	/**
	 * The graph used to represent this behavior
	 */
	@DtoProperty()
	public readonly __graph!: number;
}
