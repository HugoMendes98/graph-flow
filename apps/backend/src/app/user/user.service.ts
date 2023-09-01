import { Injectable } from "@nestjs/common";
import { UserCreateDto, UserUpdateDto } from "~/lib/common/app/user/dtos";

import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [users]{@link User}.
 */
@Injectable()
export class UserService extends EntityService<User, UserCreateDto, UserUpdateDto> {
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
		return this.repository.findOneOrFail({ email }, { populate: ["password"] });
	}
}
