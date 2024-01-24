import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType
} from "@nestjs/mapped-types";

import { NODE_KIND_DISCRIMINATOR_KEY } from "./node-kind.base.dto";
import { NodeKindVertexDto } from "./node-kind.vertex.dto";

/**
 * Class to update a "node-kind" of `VERTEX` type
 */
export class NodeKindVertexUpdateDto extends IntersectionType(
	PickType(NodeKindVertexDto, [NODE_KIND_DISCRIMINATOR_KEY]),
	PartialType(
		OmitType(NodeKindVertexDto, [NODE_KIND_DISCRIMINATOR_KEY, "__graph"])
	)
) {}
