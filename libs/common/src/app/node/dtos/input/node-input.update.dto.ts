import { PartialType } from "@nestjs/mapped-types";

import { NodeInputCreateDto } from "./node-input.create.dto";

/**
 * DTO used to update [node-inputs]{@link NodeInputDto}.
 *
 * Only possible for `code`, `parameters-out` behaviors.
 */
export class NodeInputUpdateDto extends PartialType(NodeInputCreateDto) {}
