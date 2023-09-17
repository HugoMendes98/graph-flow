import { OmitType, PickType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { NodeCreateDto } from "../../../node/dtos";
import { NodeKindEdgeDto } from "../../../node/dtos/kind";

export class GraphNodeKindCreateDto extends PickType(NodeKindEdgeDto, ["position"]) {}

export class GraphNodeCreateDto
	extends OmitType(NodeCreateDto, ["kind"])
	implements Record<keyof Pick<NodeCreateDto, "kind">, GraphNodeKindCreateDto>
{
	@Expose()
	@Type(() => GraphNodeKindCreateDto)
	@ValidateNested()
	public readonly kind!: GraphNodeKindCreateDto;
}
