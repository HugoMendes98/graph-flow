import { CategoryDto } from "./category.dto";
import { DtoProperty } from "../_lib/dto";
import { NodeRelationsDto } from "../node/node.relations.dto";

/**
 * The class representing a [category]{@link CategoryDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class CategoryRelationsDto extends CategoryDto {
	/**
	 * All [nodes]{@link NodeDto} linked to this category
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => NodeRelationsDto
	})
	public nodes?: NodeRelationsDto[];
}
