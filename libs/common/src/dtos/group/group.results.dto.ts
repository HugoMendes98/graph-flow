import { GroupDto } from "./group.dto";
import { FindResultsDtoOf } from "../_lib/find-results.dto";

/**
 * DTO results when listing [groups]{@link GroupDto}.
 */
export class GroupResultsDto extends FindResultsDtoOf(GroupDto) {}
