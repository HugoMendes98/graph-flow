import { Type } from "class-transformer";
import { IsNumber, Min, ValidateNested } from "class-validator";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindType } from "./node-kind.type";
import { DtoProperty } from "../../../../dtos/dto";
import { EntityId } from "../../../../dtos/entity";
import { GraphDto } from "../../../graph/dtos/graph.dto";
import { PositionDto } from "../position.dto";

/**
 * Class for a "node-kind" of `Edge` type
 */
export class NodeKindEdgeDto extends NodeKindBaseDto<NodeKindType.EDGE> {
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
	 * The {@lnk GraphDto} this `graph-node` is connected to
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphDto })
	public readonly graph?: GraphDto;
}
