import { IntersectionType, OmitType, PartialType, PickType } from "@nestjs/mapped-types";

import { UserDto } from "./user.dto";
import { ENTITY_BASE_KEYS } from "../../../dtos/entity";

/**
 * The mandatory keys to create an [user]{@link UserDto}.
 */
export const USER_CREATE_KEYS_MANDATORY = ["email"] as const satisfies ReadonlyArray<keyof UserDto>;

/**
 * DTO used to create [users]{@link UserDto}
 * in its {@link UserEndpoint endpoint}.
 */
export class UserCreateDto extends IntersectionType(
	PickType(UserDto, USER_CREATE_KEYS_MANDATORY),
	PartialType(OmitType(UserDto, [...ENTITY_BASE_KEYS, ...USER_CREATE_KEYS_MANDATORY]))
) {}
