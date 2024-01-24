import { IsEnum } from "class-validator";

import { NodeKindType } from "./node-kind.type";
import { DtoProperty } from "../../../../dtos/dto";

export abstract class NodeKindBaseDto<T extends NodeKindType = NodeKindType> {
	/**
	 * A unique identifier that determines the kind.
	 */
	@DtoProperty()
	@IsEnum(NodeKindType)
	public readonly type!: T;
}

/**
 * The discriminator for the node kind
 */
export type NodeKindDiscriminatorKey = keyof Pick<NodeKindBaseDto, "type">;
/**
 * The discriminator key for the node kind
 */
export const NODE_KIND_DISCRIMINATOR_KEY =
	"type" as const satisfies NodeKindDiscriminatorKey;
