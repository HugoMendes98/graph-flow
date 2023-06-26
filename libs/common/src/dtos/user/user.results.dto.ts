import { UserDto } from "./user.dto";
import { FindResultsDtoOf } from "../_lib/find-results.dto";

/**
 * DTO results when listing [users]{@link UserDto}.
 */
export class UserResultsDto extends FindResultsDtoOf(UserDto) {}
