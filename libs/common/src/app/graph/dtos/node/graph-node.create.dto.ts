import { OmitType, PickType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { NodeCreateDto } from "../../../node/dtos";
import { NodeKindEdgeDto } from "../../../node/dtos/kind";

/**
 * DTO to use when creating a `node-kind` to a `node` linked to a `graph`
 */
export class GraphNodeKindCreateDto extends PickType(NodeKindEdgeDto, ["position"]) {}

/**
 * DTO to use when creating a `node` linked to a `graph`
 */
export class GraphNodeCreateDto
	extends OmitType(NodeCreateDto, ["kind"])
	implements Record<keyof Pick<NodeCreateDto, "kind">, GraphNodeKindCreateDto>
{
	/**
	 * The kind of `EDGE` type to create
	 */
	@Expose()
	@Type(() => GraphNodeKindCreateDto)
	@ValidateNested()
	public readonly kind!: GraphNodeKindCreateDto;
}
