import { Injectable } from "@angular/core";
import { AuthLoginDto, AuthRefreshDto, AuthSuccessDto } from "~/lib/common/app/auth/dtos";
import { AUTH_ENDPOINT_PREFIX, AuthEndpoint, AuthEndpoints } from "~/lib/common/app/auth/endpoints";
import { UserDto } from "~/lib/common/app/user/dtos";

import { ApiClient } from "../api.client";

/**
 * Service to communicate with the node API.
 */
@Injectable({ providedIn: "root" })
export class AuthApiService implements AuthEndpoint {
	/**
	 * The entrypoint for auth client
	 */
	private readonly entrypoint = AUTH_ENDPOINT_PREFIX;

	public constructor(private readonly client: ApiClient) {}

	/**
	 * @inheritDoc
	 */
	public getProfile(): Promise<UserDto> {
		return this.client.get(`${this.entrypoint}/${AuthEndpoints.PROFILE}`);
	}

	/**
	 * @inheritDoc
	 */
	public login(body: AuthLoginDto): Promise<AuthSuccessDto> {
		return this.client.post(`${this.entrypoint}/${AuthEndpoints.LOGIN}`, body);
	}

	/**
	 * @inheritDoc
	 */
	public refresh(body: AuthRefreshDto): Promise<AuthSuccessDto> {
		return this.client.post(`${this.entrypoint}/${AuthEndpoints.REFRESH}`, body);
	}
}
