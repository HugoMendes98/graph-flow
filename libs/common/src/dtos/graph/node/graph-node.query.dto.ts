import { GraphNodeRelationsDto } from "./graph-node.relations.dto";
import { FindQueryDtoOf } from "../../_lib/find-query.dto";

/**
 * DTO Query used to filter [nodes]{@link GraphNodeRelationsDto}.
 */
export class GraphNodeQueryDto extends FindQueryDtoOf(GraphNodeRelationsDto) {}
