import { IsEnum } from "class-validator";

import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

/**
 * Base behavior of any node
 */
export abstract class NodeBehaviorBaseDto {
	/**
	 * @returns The type for this DTO
	 */
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

/**
 * The discriminator for the node behaviors
 */
export type NodeBehaviorDiscriminatorKey = keyof Pick<NodeBehaviorBaseDto, "type">;
