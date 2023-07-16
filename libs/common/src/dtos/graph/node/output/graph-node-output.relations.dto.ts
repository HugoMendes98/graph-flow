import { GraphNodeOutputDto } from "./graph-node-output.dto";
import { DtoProperty } from "../../../_lib/dto";
import { NodeOutputRelationsDto } from "../../../node/output/node-output.relations.dto";
import { GraphNodeRelationsDto } from "../graph-node.relations.dto";

export class GraphNodeOutputRelationsDto extends GraphNodeOutputDto {
	/**
	 * The [graph-node]{@link GraphNodeDto} linked to this graph-node-output
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeRelationsDto })
	public graphNode?: GraphNodeRelationsDto;

	/**
	 * The [node-output]{@link NodeInputDto} linked to this graph-node-output
	 */
	@DtoProperty({ forwardRef: true, type: () => NodeOutputRelationsDto })
	public nodeOutput?: NodeOutputRelationsDto;
}
