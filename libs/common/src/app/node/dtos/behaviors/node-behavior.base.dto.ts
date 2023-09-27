import { IsEnum } from "class-validator";

import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";
import { omit } from "../../../../utils/object-fns";

/**
 * Base behavior of any node
 */
export abstract class NodeBehaviorBaseDto<T extends NodeBehaviorType = NodeBehaviorType> {
	/**
	 * A unique identifier that determines the behavior.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(omit(NodeBehaviorType, ["PARAMETER_IN", "PARAMETER_OUT"]))
	public readonly type!: T;
}

/**
 * The discriminator for the node behaviors
 */
export type NodeBehaviorDiscriminatorKey = keyof Pick<NodeBehaviorBaseDto, "type">;
/**
 * The discriminator key for the node kind
 */
export const NODE_BEHAVIOR_DISCRIMINATOR_KEY =
	"type" as const satisfies NodeBehaviorDiscriminatorKey;
