import { GraphRelationsDto } from "./graph.relations.dto";
import { FindQueryDtoOf } from "../_lib/find-query.dto";

/**
 * DTO Query used to filter [graphs]{@link GraphRelationsDto}.
 */
export class GraphQueryDto extends FindQueryDtoOf(GraphRelationsDto) {}
