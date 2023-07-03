import { NodeDto } from "./node.dto";
import { DtoProperty } from "../_lib/dto";
import { CategoryRelationsDto } from "../category/category.relations.dto";

/**
 * The class representing a [node]{@link NodeDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class NodeRelationsDto extends NodeDto {
	/**
	 * All [categories]{@link CategoryDto} linked to this node
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => CategoryRelationsDto
	})
	public categories?: CategoryRelationsDto[];
	// Note: Node is the owning side
}
