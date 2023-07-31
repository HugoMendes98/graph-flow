import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../../../dtos/dto";
import { EntityDto } from "../../../../../dtos/entity";
import { NodeOutputDto } from "../../../../node/dtos/output/node-output.dto";
import { GraphArcDto } from "../../arc/graph-arc.dto";
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
	 * The [graph-arcs]{@link GraphArcDto} connected to this graph-node-output
	 */
	@DtoProperty({ array: true, forwardRef: true, type: () => GraphArcDto })
	public readonly graphArcs?: GraphArcDto[];

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
