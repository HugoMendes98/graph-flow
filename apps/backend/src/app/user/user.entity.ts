import { Collection, Entity, EntityRepositoryType, OneToMany, Property } from "@mikro-orm/core";
import { UserRelationsDto } from "~/app/common/dtos/user/user.relations.dto";

import { UserRepository } from "./user.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";
import { Group } from "../group/group.entity";

/**
 * The entity class to manage users
 */
@Entity({ customRepository: () => UserRepository })
export class User extends EntityBase implements EntityWithRelations<UserRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: UserRepository;

	@Property({ unique: true })
	public email!: string;

	@Property({ nullable: true, type: String })
	public firstname: string | null = null;

	@Property({ nullable: true, type: String })
	public lastname: string | null = null;

	@OneToMany(() => Group, group => group.creator, { hidden: true })
	public creations? = new Collection<Group>(this);
}
