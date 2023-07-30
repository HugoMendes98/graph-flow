import { OmitType, PartialType } from "@nestjs/mapped-types";

import { GraphNodeCreateDto } from "./graph-node.create.dto";

/**
 * DTO used to update [graph-nodes]{@link GraphNodeDto}.
 *
 * Can not change the node foreign key
 */
export class GraphNodeUpdateDto extends PartialType(OmitType(GraphNodeCreateDto, ["__node"])) {}
