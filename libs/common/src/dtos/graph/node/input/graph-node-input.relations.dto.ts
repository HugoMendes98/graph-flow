import { GraphNodeInputDto } from "./graph-node-input.dto";
import { DtoProperty } from "../../../_lib/dto";
import { NodeInputRelationsDto } from "../../../node/input/node-input.relations.dto";
import { GraphNodeRelationsDto } from "../graph-node.relations.dto";

/**
 * The class representing a [graph-node-input]{@link GraphNodeInputDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class GraphNodeInputRelationsDto extends GraphNodeInputDto {
	/**
	 * The [graph-node]{@link GraphNodeDto} linked to this graph-node-input
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeRelationsDto })
	public graphNode?: GraphNodeRelationsDto;

	/**
	 * The [node-input]{@link NodeInputDto} linked to this graph-node-input
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeInputRelationsDto })
	public nodeInput?: NodeInputRelationsDto;
}
