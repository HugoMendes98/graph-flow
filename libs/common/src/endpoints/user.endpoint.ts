import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { UserCreateDto, UserDto, UserUpdateDto } from "../dtos/user";

/**
 * Endpoint path for [users]{@link UserDto} (without global prefix).
 */
export const USERS_ENDPOINT_PREFIX = "/v1/users";

export type User = Jsonify<UserDto>;
export type UserEndpoint<Serialized extends boolean = false> = EntityEndpoint<
	Serialized extends true ? User : UserDto,
	UserCreateDto,
	UserUpdateDto
>;
