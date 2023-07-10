import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../_lib/dto";

/**
 * A position in a cartesian space (2D)
 */
export class PositionDto {
	/**
	 * The x position in a 2D plan
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public x!: number;

	/**
	 * The y position in a 2D plan
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public y!: number;
}
