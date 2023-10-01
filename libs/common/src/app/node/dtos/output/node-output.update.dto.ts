import { PartialType, PickType } from "@nestjs/mapped-types";

import { NodeOutputDto } from "./node-output.dto";

/**
 * DTO used to update [node-outputs]{@link NodeOutputDto}.
 *
 * Only to change the type of `variable`, `parameter-in`, `code` node-behaviors
 */
export class NodeOutputUpdateDto extends PartialType(PickType(NodeOutputDto, ["name", "type"])) {}
