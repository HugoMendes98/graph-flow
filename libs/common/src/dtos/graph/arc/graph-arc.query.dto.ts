import { GraphArcDto } from "./graph-arc.dto";
import { FindQueryDtoOf } from "../../_lib/find-query.dto";

/**
 * DTO Query used to filter [nodes]{@link GraphArcDto}.
 */
export class GraphArcQueryDto extends FindQueryDtoOf(GraphArcDto) {}
