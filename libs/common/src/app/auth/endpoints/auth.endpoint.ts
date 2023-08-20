import { UserDto } from "../../user/dtos";
import { AuthLoginDto, AuthRefreshDto } from "../dtos";
import { AuthSuccessDto } from "../dtos/auth.success.dto";

/**
 * Endpoint path for authentication.
 */
export const AUTH_ENDPOINT_PREFIX = "/v1/auth";

export interface AuthEndpoint {
	/**
	 * @returns the connected user
	 */
	getProfile(): Promise<UserDto>;
	/**
	 * Log in a user
	 *
	 * @param body with the credentials
	 */
	login(body: AuthLoginDto): Promise<AuthSuccessDto>;

	/**
	 * Refresh an existing token
	 *
	 * @param body the options when refreshing
	 */
	refresh(body: AuthRefreshDto): Promise<AuthSuccessDto>;
}

export enum AuthEndpoints {
	LOGIN = "login",
	PROFILE = "profile",
	REFRESH = "refresh"
}
