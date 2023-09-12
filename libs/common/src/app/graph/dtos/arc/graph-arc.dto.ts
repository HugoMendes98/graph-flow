import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto } from "../../../../dtos/entity";
import { NodeInputDto } from "../../../node/dtos/input";
import { NodeOutputDto } from "../../../node/dtos/output";

/**
 * DTO for the arcs in the graph
 */
export class GraphArcDto extends EntityDto {
	/**
	 * The foreign key value to the [graph-node-output]{@link NodeOutputDto}
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __from!: number;

	/**
	 * The foreign key value to the [graph-node-input]{@link NodeInputDto}
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __to!: number;

	// ------- Relations -------

	/**
	 * The [graph-node-output]{@link NodeOutputDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => NodeOutputDto })
	public readonly from?: NodeOutputDto;

	/**
	 * The [graph-node-input]{@link NodeInputDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => NodeInputDto })
	public readonly to?: NodeInputDto;
}
