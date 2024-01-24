import { Injectable } from "@nestjs/common";
import {
	UserCreateDto,
	UserDto,
	UserUpdateDto
} from "~/lib/common/app/user/dtos";

import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";
import { EntityService } from "../_lib/entity";

/**
 * Update of an user from the service
 */
export interface UserUpdateEntity
	extends UserUpdateDto,
		Pick<Partial<UserDto>, "email"> {}

/**
 * Service to manages [users]{@link UserEntity}.
 */
@Injectable()
export class UserService extends EntityService<
	UserEntity,
	UserCreateDto,
	UserUpdateEntity
> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: UserRepository) {
		super(repository);
	}

	/**
	 * Searches for a user with the given credentials
	 *
	 * @param email The email to search
	 * @returns the user with the given credentials
	 */
	public findByCredentials(email: string) {
		return this.repository.findOneOrFail(
			{ email },
			{ populate: ["password"] }
		);
	}
}
