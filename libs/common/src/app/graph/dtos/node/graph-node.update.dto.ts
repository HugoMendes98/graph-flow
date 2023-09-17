import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { GraphNodeCreateDto, GraphNodeKindCreateDto } from "./graph-node.create.dto";

export class GraphNodeKindUpdateDto extends PartialType(GraphNodeKindCreateDto) {}

export class GraphNodeUpdateDto extends PartialType(OmitType(GraphNodeCreateDto, ["kind"])) {
	@Expose()
	@Type(() => GraphNodeKindUpdateDto)
	@ValidateNested()
	public readonly kind?: GraphNodeKindUpdateDto;
}
