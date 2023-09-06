import { PickType } from "@nestjs/mapped-types";

import { GraphNodeInputDto } from "./graph-node-input.dto";

/**
 * DTO used to create [graph-node-inputs]{@link GraphNodeInputDto}.
 */
export class GraphNodeInputCreateDto extends PickType(GraphNodeInputDto, [
	"__graph_node",
	"__node_input"
]) {}
