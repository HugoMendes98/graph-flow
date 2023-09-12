import { OmitType, PartialType } from "@nestjs/mapped-types";

import { NodeCreateDto } from "./node.create.dto";

export class NodeKindUpdateDto {
	// extends PickType(NodeKindEdgeDto, ["position"])
}

/**
 * DTO used to update [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeUpdateDto
	extends PartialType(OmitType(NodeCreateDto, ["behavior", "kind"]))
	implements Partial<Record<keyof Pick<NodeCreateDto, "kind">, NodeKindUpdateDto>>
{
	// @Type(() => NodeKindUpdateDto)
	// @ValidateNested()
	public kind?: NodeKindUpdateDto;
}
