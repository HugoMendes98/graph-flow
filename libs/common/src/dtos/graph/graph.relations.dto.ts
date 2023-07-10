import { GraphDto } from "./graph.dto";
import { DtoProperty } from "../_lib/dto";
import { GraphNodeRelationsDto } from "../graph/node";

/**
 * The class representing a [graph]{@link GraphDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class GraphRelationsDto extends GraphDto {
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => GraphNodeRelationsDto
	})
	public nodes?: GraphNodeRelationsDto[];
}
