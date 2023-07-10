import { GraphNodeDto } from "./graph-node.dto";
import { DtoProperty } from "../../_lib/dto";
import { NodeRelationsDto } from "../../node";
import { GraphRelationsDto } from "../graph.relations.dto";

/**
 * The class representing a [graph-node]{@link GraphNodeDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class GraphNodeRelationsDto extends GraphNodeDto {
	@DtoProperty({
		forwardRef: true,
		type: () => GraphRelationsDto
	})
	public graph?: GraphRelationsDto;

	@DtoProperty({
		forwardRef: true,
		type: () => NodeRelationsDto
	})
	public node?: NodeRelationsDto;
}
