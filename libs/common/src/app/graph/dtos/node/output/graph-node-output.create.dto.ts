import { PickType } from "@nestjs/mapped-types";

import { GraphNodeOutputDto } from "./graph-node-output.dto";

/**
 * DTO used to create [graph-node-outputs]{@link GraphNodeOutputDto}.
 */
export class GraphNodeOutputCreateDto extends PickType(GraphNodeOutputDto, [
	"__graph_node",
	"__node_output"
]) {}
