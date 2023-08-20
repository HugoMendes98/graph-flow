import { IntersectionType, PickType } from "@nestjs/mapped-types";
import { IsString, MinLength } from "class-validator";

import { AuthRefreshDto } from "./auth.refresh.dto";
import { UserCreateDto } from "../../user/dtos";

export class AuthLoginDto extends IntersectionType(
	PickType(UserCreateDto, ["email"]),
	AuthRefreshDto
) {
	/**
	 * The password for login
	 */
	@IsString()
	@MinLength(4)
	public readonly password!: string;
}
