import { Entity, Property } from "@mikro-orm/core";
import { UserDto } from "~/lib/common/app/user/dtos";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { UserRepository } from "./user.repository";
import { EntityBase } from "../_lib/entity";

/**
 * The entity class to manage users
 */
@Entity({ customRepository: () => UserRepository })
export class UserEntity extends EntityBase implements DtoToEntity<UserDto> {
	/** @inheritDoc */
	@Property({ unique: true })
	public email!: string;

	@Property({ hidden: true, nullable: false })
	public password?: string;

	/** @inheritDoc */
	@Property({ nullable: true, type: String })
	public firstname: string | null = null;

	/** @inheritDoc */
	@Property({ nullable: true, type: String })
	public lastname: string | null = null;
}
