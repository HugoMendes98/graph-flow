import { GraphDto } from "./graph.dto";
import { FindResultsDtoOf } from "../_lib/find-results.dto";

/**
 * DTO results when listing [graphs]{@link GraphDto}.
 */
export class GraphResultsDto extends FindResultsDtoOf(GraphDto) {}
