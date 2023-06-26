import { PartialType } from "@nestjs/mapped-types";

import { GroupCreateDto } from "./group.create.dto";

/**
 * DTO used to update [groups]{@link GroupDto}
 * in its {@link GroupEndpoint endpoint}.
 */
export class GroupUpdateDto extends PartialType(GroupCreateDto) {}
