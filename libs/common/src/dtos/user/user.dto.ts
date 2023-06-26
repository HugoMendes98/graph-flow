import { IsEmail, IsString } from "class-validator";

import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

/**
 * DTO for users entities
 */
export class UserDto extends EntityDto {
	/**
	 * The email of the user
	 */
	@DtoProperty()
	@IsEmail()
	public email!: string;

	/**
	 * The firstname of the user
	 */
	@DtoProperty({ nullable: true, type: () => String })
	@IsString()
	public firstname!: string | null;

	/**
	 * The lastname of the user
	 */
	@DtoProperty({ nullable: true, type: () => String })
	@IsString()
	public lastname!: string | null;
}
