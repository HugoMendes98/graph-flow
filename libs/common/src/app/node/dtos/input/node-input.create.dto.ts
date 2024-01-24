import { PickType } from "@nestjs/mapped-types";

import { NodeInputDto } from "./node-input.dto";

/**
 * DTO to use when creating a `node-input`
 *
 * Only possible for `code` behaviors.
 */
export class NodeInputCreateDto extends PickType(NodeInputDto, [
	"name",
	"type"
]) {}
