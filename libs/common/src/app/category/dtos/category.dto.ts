import { IsString, MinLength } from "class-validator";

import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { NodeDto } from "../../node/dtos/node.dto";

/**
 * DTO for category entities
 */
export class CategoryDto extends EntityDto {
	/**
	 * The unique name of a category
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	// TODO: color?

	// ------- Relations -------
	/**
	 * All [nodes]{@link NodeDto} linked to this category
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => NodeDto
	})
	public readonly nodes?: NodeDto[];
}
