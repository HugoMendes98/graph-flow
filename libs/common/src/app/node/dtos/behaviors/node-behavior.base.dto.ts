import { IsEnum } from "class-validator";

import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

export abstract class NodeBehaviorBaseDto {
	public static get TYPE(): NodeBehaviorType {
		return this.prototype.type;
	}

	/**
	 * A unique identifier that determines the behavior.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(NodeBehaviorType)
	public abstract readonly type: NodeBehaviorType;
}

export type NodeBehaviorDiscriminatorKey = keyof Pick<NodeBehaviorBaseDto, "type">;
