import { PartialType } from "@nestjs/mapped-types";

import { NodeCreateDto } from "./node.create.dto";

/**
 * DTO used to update [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeUpdateDto extends PartialType(NodeCreateDto) {}
