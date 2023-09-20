import { IsEnum } from "class-validator";

import { NodeKindType } from "./node-kind.type";
import { DtoProperty } from "../../../../dtos/dto";

export abstract class NodeKindBaseDto {
	/**
	 * @returns The type for this DTO
	 */
	public static get TYPE(): NodeKindType {
		return this.prototype.type;
	}

	/**
	 * A unique identifier that determines the kind.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(NodeKindType)
	public abstract readonly type: NodeKindType;
}

/**
 * The discriminator for the node kind
 */
export type NodeKindDiscriminatorKey = keyof Pick<NodeKindBaseDto, "type">;
/**
 * The discriminator value for the node kind
 */
export const NODE_KIND_DISCRIMINATOR_KEY = "type" as const satisfies NodeKindDiscriminatorKey;
