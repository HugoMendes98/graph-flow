import { Entity, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { UserDto } from "~/lib/common/dtos/user";

import { UserRepository } from "./user.repository";
import { EntityBase } from "../_lib/entity";

/**
 * The entity class to manage users
 */
@Entity({ customRepository: () => UserRepository })
export class User extends EntityBase implements DtoToEntity<UserDto> {
	@Property({ unique: true })
	public email!: string;

	@Property({ nullable: true, type: String })
	public firstname: string | null = null;

	@Property({ nullable: true, type: String })
	public lastname: string | null = null;
}
