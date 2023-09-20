import { IsNumber, Min } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { EntityId } from "../../../../dtos/entity";
import type { NodeDto } from "../node.dto";

/**
 * Behavior of a node that reference another one
 */
export class NodeBehaviorReferenceDto extends NodeBehaviorBaseDto<NodeBehaviorType.REFERENCE> {
	/**
	 * The node that this behavior "references"
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __node!: EntityId;

	// Relations

	/**
	 * The node relation that this behavior "references"
	 */
	@DtoProperty()
	public readonly node?: NodeDto;
}
