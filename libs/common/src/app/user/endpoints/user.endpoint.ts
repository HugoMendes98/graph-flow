import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { UserCreateDto, UserDto, UserUpdateDto } from "../dtos";

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
