import { Injectable } from "@nestjs/common";
import { GroupCreateDto, GroupUpdateDto } from "~/app/common/dtos/group";

import { Group } from "./group.entity";
import { GroupRepository } from "./group.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [groups]{@link Group}.
 */
@Injectable()
export class GroupService extends EntityService<Group, GroupCreateDto, GroupUpdateDto> {
	public constructor(repository: GroupRepository) {
		super(repository);
	}
}
