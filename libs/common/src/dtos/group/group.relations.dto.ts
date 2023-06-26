import { GroupDto } from "./group.dto";
import { DtoProperty } from "../_lib/dto";
import { UserRelationsDto } from "../user";

/**
 * The class representing a [group]{@link GroupDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class GroupRelationsDto extends GroupDto {
	/**
	 * The [user]{@link UserRelationsDto}, if defined, who created this group
	 */
	@DtoProperty({
		forwardRef: true,
		nullable: true,
		type: () => UserRelationsDto
	})
	public creator?: UserRelationsDto | null;
}
