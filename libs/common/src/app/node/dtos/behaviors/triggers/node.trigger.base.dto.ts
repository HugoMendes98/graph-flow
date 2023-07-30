import { IsEnum } from "class-validator";

import { NodeTriggerType } from "./node.trigger.type";
import { DtoProperty } from "../../../../../dtos/dto";

export abstract class NodeTriggerBaseDto {
	public static get TYPE(): NodeTriggerType {
		return this.prototype.type;
	}

	/**
	 * A unique identifier that determines the trigger.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(NodeTriggerType)
	public abstract readonly type: NodeTriggerType;
}

export type NodeTriggerDiscriminatorKey = keyof Pick<NodeTriggerBaseDto, "type">;
