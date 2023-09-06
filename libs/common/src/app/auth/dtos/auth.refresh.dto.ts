import { IsBoolean, IsOptional } from "class-validator";

export class AuthRefreshDto {
	/**
	 * When set to true, the server will set a HTTP only cookie with the token value
	 *
	 * @default false
	 */
	@IsBoolean()
	@IsOptional()
	public readonly cookie?: boolean = false;
}
