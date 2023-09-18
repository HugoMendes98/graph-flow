import { PickType } from "@nestjs/mapped-types";

import { NodeOutputDto } from "./node-output.dto";

/**
 * DTO to use when creating a `node-output`
 */
export class NodeOutputCreateDto extends PickType(NodeOutputDto, ["name", "type"]) {}
