import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../_lib/dto";
import { EntityDto } from "../../_lib/entity";

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
}
