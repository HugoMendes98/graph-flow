import { GraphArcDto } from "./graph-arc.dto";
import { FindResultsDtoOf } from "../../../../dtos/find-results.dto";

/**
 * DTO results when listing [graph-arcs]{@link GraphArcDto}.
 */
export class GraphArcResultsDto extends FindResultsDtoOf(GraphArcDto) {}
