import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { GraphNodeCreateDto, GraphNodeKindCreateDto } from "./graph-node.create.dto";

/**
 * DTO to use when updating a `node-kind` to a `node` linked to a `graph`
 */
export class GraphNodeKindUpdateDto extends PartialType(GraphNodeKindCreateDto) {}

/**
 * DTO to use when updating a `node` linked to a `graph`
 */
export class GraphNodeUpdateDto extends PartialType(OmitType(GraphNodeCreateDto, ["kind"])) {
	/**
	 * The kind of `EDGE` type to update
	 */
	@Expose()
	@Type(() => GraphNodeKindUpdateDto)
	@ValidateNested()
	public readonly kind?: GraphNodeKindUpdateDto;
}
