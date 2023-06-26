import { GroupRelationsDto } from "./group.relations.dto";
import { FindQueryDtoOf } from "../_lib/find-query.dto";

/**
 * DTO Query used to filter [groups]{@link GroupDto}
 * in its {@link GroupEndpoint endpoint}.
 */
export class GroupQueryDto extends FindQueryDtoOf(GroupRelationsDto) {}
