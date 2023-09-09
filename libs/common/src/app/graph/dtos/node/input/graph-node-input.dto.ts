import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../../../dtos/dto";
import { EntityDto } from "../../../../../dtos/entity";
import { NodeInputDto } from "../../../../node/dtos/input/node-input.dto";
import { GraphArcDto } from "../../arc/graph-arc.dto";
import { GraphNodeDto } from "../graph-node.dto";

/**
 * DTO for the input of a node in the graph
 */
export class GraphNodeInputDto extends EntityDto {
	/**
	 * The foreign key to the graph-node this input is linked to
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __graph_node!: number;

	/**
	 * The foreign key to the node-input this graph input represents
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node_input!: number;

	// ------- Relations -------

	/**
	 * The [node-input]{@link NodeInputDto} linked to this graph-node-input
	 */
	@DtoProperty({ forwardRef: true, type: () => NodeInputDto })
	public readonly nodeInput!: NodeInputDto;

	/**
	 * The [graph-arc]{@link GraphArcDto} connected to this graph-node-input
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphArcDto })
	public readonly graphArc?: GraphArcDto;

	/**
	 * The [graph-node]{@link GraphNodeDto} linked to this graph-node-input
	 */
	@DtoProperty({ forwardRef: true, type: () => GraphNodeDto })
	public readonly graphNode?: GraphNodeDto;
}
