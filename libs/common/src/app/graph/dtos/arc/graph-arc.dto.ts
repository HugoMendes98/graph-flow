import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto } from "../../../../dtos/entity";
import { GraphNodeInputDto } from "../node/input/graph-node-input.dto";
import { GraphNodeOutputDto } from "../node/output/graph-node-output.dto";

export class GraphArcDto extends EntityDto {
	/**
	 * The foreign key value to the [graph-node-output]{@link GraphNodeOutputDto}
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __from!: number;

	/**
	 * The foreign key value to the [graph-node-input]{@link GraphNodeInputDto}
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __to!: number;

	// ------- Relations -------

	/**
	 * The [graph-node-output]{@link GraphNodeOutputDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeOutputDto })
	public readonly from?: GraphNodeOutputDto;

	/**
	 * The [graph-node-input]{@link GraphNodeInputDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeInputDto })
	public readonly to?: GraphNodeInputDto;
}
