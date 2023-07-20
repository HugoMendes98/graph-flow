import { Injectable } from "@nestjs/common";
import { UserCreateDto, UserUpdateDto } from "~/lib/common/dtos/user";

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
}
