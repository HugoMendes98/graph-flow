import { GraphArcRelationsDto } from "./graph-arc.relations.dto";
import { FindQueryDtoOf } from "../../_lib/find-query.dto";

/**
 * DTO Query used to filter [nodes]{@link GraphArcRelationsDto}.
 */
export class GraphArcQueryDto extends FindQueryDtoOf(GraphArcRelationsDto) {}
