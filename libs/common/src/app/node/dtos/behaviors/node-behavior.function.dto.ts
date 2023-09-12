import { IsNumber, Min } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { EntityId } from "../../../../dtos/entity";

/**
 * Behavior of a node that is a function
 */
export class NodeBehaviorFunctionDto extends NodeBehaviorBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeBehaviorType.FUNCTION;

	// TODO: input/output, graph (same thing as for a workflow)

	/**
	 * The graph used to represent this behavior
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __graph!: EntityId;
}
