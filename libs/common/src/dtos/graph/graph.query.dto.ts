import { GraphDto } from "./graph.dto";
import { FindQueryDtoOf } from "../_lib/find-query.dto";

/**
 * DTO Query used to filter [graphs]{@link GraphDto}.
 */
export class GraphQueryDto extends FindQueryDtoOf(GraphDto) {}
