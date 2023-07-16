import { GraphArcDto } from "./graph-arc.dto";
import { DtoProperty } from "../../_lib/dto";
import { GraphNodeInputRelationsDto } from "../node/input/graph-node-input.relations.dto";
import { GraphNodeOutputRelationsDto } from "../node/output/graph-node-output.relations.dto";

/**
 * The class representing a [graph-arc]{@link GraphArcDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class GraphArcRelationsDto extends GraphArcDto {
	/**
	 * The [graph-node-output]{@link GraphNodeOutputRelationsDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeOutputRelationsDto })
	public from?: GraphNodeOutputRelationsDto;

	/**
	 * The [graph-node-input]{@link GraphNodeInputRelationsDto} linked to this arc
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeInputRelationsDto })
	public to?: GraphNodeInputRelationsDto;
}
