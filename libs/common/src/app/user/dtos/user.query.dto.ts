import { UserDto } from "./user.dto";
import { FindQueryDtoOf } from "../../../dtos/find-query.dto";

/**
 * DTO Query used to filter [users]{@link UserDto}
 * in its {@link UserEndpoint endpoint}.
 */
export class UserQueryDto extends FindQueryDtoOf(UserDto) {}
