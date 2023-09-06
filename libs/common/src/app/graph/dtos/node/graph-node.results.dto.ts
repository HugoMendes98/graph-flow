import { GraphNodeDto } from "./graph-node.dto";
import { FindResultsDtoOf } from "../../../../dtos/find-results.dto";

/**
 * DTO results when listing [nodes]{@link GraphNodeDto}.
 */
export class GraphNodeResultsDto extends FindResultsDtoOf(GraphNodeDto) {}
