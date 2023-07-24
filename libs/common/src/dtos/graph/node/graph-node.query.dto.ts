import { GraphNodeDto } from "./graph-node.dto";
import { FindQueryDtoOf } from "../../_lib/find-query.dto";

/**
 * DTO Query used to filter [nodes]{@link GraphNodeDto}.
 */
export class GraphNodeQueryDto extends FindQueryDtoOf(GraphNodeDto) {}
