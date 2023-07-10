import { GraphNodeDto } from "./graph-node.dto";
import { FindResultsDtoOf } from "../../_lib/find-results.dto";

/**
 * DTO results when listing [nodes]{@link GraphNodeDto}.
 */
export class GraphNodeResultsDto extends FindResultsDtoOf(GraphNodeDto) {}
