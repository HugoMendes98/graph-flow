import { IsString, MinLength } from "class-validator";

import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

/**
 * DTO for node entities.
 *
 * (This is for node templates, not nodes in a graph)
 */
export class NodeDto extends EntityDto {
	/**
	 * The name (not unique of a node)
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	// TODO: color?
	// TODO: number of inputs/outputs

	// TODO: type (discriminator: https://mikro-orm.io/docs/inheritance-mapping#explicit-discriminator-column?)
}
