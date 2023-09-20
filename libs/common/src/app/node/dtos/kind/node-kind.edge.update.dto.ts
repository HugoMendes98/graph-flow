import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/mapped-types";

import { NODE_KIND_DISCRIMINATOR_KEY } from "./node-kind.base.dto";
import { NodeKindEdgeDto } from "./node-kind.edge.dto";
import { NodeKindType } from "./node-kind.type";

/**
 * Class to update a "node-kind" of `edge` type
 */
export class NodeKindEdgeUpdateDto extends IntersectionType(
	PickType(NodeKindEdgeDto, [NODE_KIND_DISCRIMINATOR_KEY]),
	PartialType(OmitType(NodeKindEdgeDto, [NODE_KIND_DISCRIMINATOR_KEY, "__graph"]))
) {
	/**
	 * @returns The type for this DTO
	 */
	public static get TYPE(): NodeKindType {
		return NodeKindType.EDGE;
	}
}
