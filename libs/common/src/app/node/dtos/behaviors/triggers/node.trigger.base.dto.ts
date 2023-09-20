import { IsEnum } from "class-validator";

import { NodeTriggerType } from "./node.trigger.type";
import { DtoProperty } from "../../../../../dtos/dto";

/**
 * Base DTO for `node-trigger`
 */
export abstract class NodeTriggerBaseDto<T extends NodeTriggerType = NodeTriggerType> {
	/**
	 * A unique identifier that determines the trigger.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(NodeTriggerType)
	public readonly type!: T;
}

/**
 * The discriminator for the `node-trigger`
 */
export type NodeTriggerDiscriminatorKey = keyof Pick<NodeTriggerBaseDto, "type">;
