import { PickType } from "@nestjs/mapped-types";

import { NodeInputDto } from "./node-input.dto";

/**
 * DTO to use when creating a `node-input`
 */
export class NodeInputCreateDto extends PickType(NodeInputDto, ["name", "type"]) {}
