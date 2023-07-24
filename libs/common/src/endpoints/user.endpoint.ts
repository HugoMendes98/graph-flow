import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { DtoToEntity } from "../dtos/_lib/entity/entity.types";
import { UserCreateDto, UserDto, UserUpdateDto } from "../dtos/user";

/**
 * Endpoint path for [users]{@link UserDto} (without global prefix).
 */
export const USERS_ENDPOINT_PREFIX = "/v1/users";

export type User = Jsonify<UserDto>;
export type UserEndpoint<T extends DtoToEntity<UserDto> | User = User> = EntityEndpoint<
	T,
	UserCreateDto,
	UserUpdateDto
>;
