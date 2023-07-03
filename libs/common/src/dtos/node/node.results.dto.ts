import { NodeDto } from "./node.dto";
import { FindResultsDtoOf } from "../_lib/find-results.dto";

/**
 * DTO results when listing [nodes]{@link NodeDto}.
 */
export class NodeResultsDto extends FindResultsDtoOf(NodeDto) {}
