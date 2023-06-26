import { Entity, EntityRepositoryType } from "@mikro-orm/core";
import { EntityId } from "~/app/common/dtos/_lib/entity";
import { TranslationDto } from "~/app/common/dtos/_lib/translation";
import { GroupDto, GroupRelationsDto } from "~/app/common/dtos/group";
import { UserDto } from "~/app/common/dtos/user";

import { GroupRepository } from "./group.repository";
import { EntityWithRelations } from "../_lib/entity";
import { ManyToOneFactory } from "../_lib/entity/decorators";
import { I18nEntity, I18nProperty } from "../_lib/i18n";
import { User } from "../user/user.entity";

/**
 * Decorator for the Creator relation property
 */
const CreatorProperty = ManyToOneFactory(() => User, {
	fieldName: "__creator" satisfies keyof GroupDto,
	nullable: true,
	onUpdateIntegrity: "cascade"
});

/**
 * The entity class to manage groups
 */
@Entity({ customRepository: () => GroupRepository })
export class Group extends I18nEntity implements EntityWithRelations<GroupRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: GroupRepository;

	@CreatorProperty({ foreign: false })
	public __creator: EntityId | null = null;
	@CreatorProperty({ foreign: true })
	public creator?: UserDto | null = null;

	@I18nProperty()
	public description: TranslationDto = {};
}
