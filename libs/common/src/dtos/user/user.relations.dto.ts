import { UserDto } from "./user.dto";
import { DtoProperty } from "../_lib/dto";
import { GroupRelationsDto } from "../group";

/**
 * The class representing a [user]{@link UserDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class UserRelationsDto extends UserDto {
	/**
	 * The list of all the [groups]{@link GroupRelationsDto} created by this user
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => GroupRelationsDto
	})
	public creations?: GroupRelationsDto[];
}
