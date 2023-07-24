import { NodeDto } from "./node.dto";
import { FindQueryDtoOf } from "../_lib/find-query.dto";

/**
 * DTO Query used to filter [nodes]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeQueryDto extends FindQueryDtoOf(NodeDto) {}
