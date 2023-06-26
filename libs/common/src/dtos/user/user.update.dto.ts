import { PartialType } from "@nestjs/mapped-types";

import { UserCreateDto } from "./user.create.dto";

/**
 * DTO used to update [users]{@link UserDto}
 * in its {@link UserEndpoint endpoint}.
 */
export class UserUpdateDto extends PartialType(UserCreateDto) {}
