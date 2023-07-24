import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../_lib/dto";
import { EntityDto } from "../../../_lib/entity";
import { NodeOutputDto } from "../../../node/output";
import { GraphNodeDto } from "../graph-node.dto";

export class GraphNodeOutputDto extends EntityDto {
	/**
	 * The foreign key to the graph-node this input is linked to
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __graph_node!: number;

	/**
	 * The foreign key to the node-output this graph-output represents
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node_output!: number;

	// ------- Relations -------

	/**
	 * The [graph-node]{@link GraphNodeDto} linked to this graph-node-output
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeDto })
	public readonly graphNode?: GraphNodeDto;

	/**
	 * The [node-output]{@link NodeInputDto} linked to this graph-node-output
	 */
	@DtoProperty({ forwardRef: true, type: () => NodeOutputDto })
	public readonly nodeOutput?: NodeOutputDto;
}
