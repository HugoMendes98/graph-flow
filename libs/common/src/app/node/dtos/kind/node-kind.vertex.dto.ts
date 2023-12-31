import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min, ValidateNested } from "class-validator";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindType } from "./node-kind.type";
import { DtoProperty } from "../../../../dtos/dto";
import { EntityId } from "../../../../dtos/entity";
import { GraphDto } from "../../../graph/dtos/graph.dto";
import { PositionDto } from "../position.dto";

/**
 * Class for a "node-kind" of `VERTEX` type
 */
export class NodeKindVertexDto extends NodeKindBaseDto<NodeKindType.VERTEX> {
	/**
	 * The [graph]{@link GraphDto} on which it is
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __graph!: EntityId;

	/**
	 * The position of the node in a 2D plan
	 */
	@DtoProperty()
	@Type(() => PositionDto)
	@ValidateNested()
	public position!: PositionDto;

	// Relations

	/**
	 * The {@link GraphDto} this `graph-node` is connected to
	 */
	@DtoProperty({ expose: false, type: () => GraphDto })
	@IsOptional() // FIXME: Use a `createDto` instead
	public readonly graph?: GraphDto;
}
