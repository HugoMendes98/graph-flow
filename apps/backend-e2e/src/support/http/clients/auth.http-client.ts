import axios, { Axios } from "axios";
import { AuthSuccessDto } from "~/lib/common/app/auth/dtos";
import { AUTH_ENDPOINT_PREFIX, AuthEndpoints } from "~/lib/common/app/auth/endpoints";
import { UserDto } from "~/lib/common/app/user/dtos";
import { DropFirst } from "~/lib/common/types";

export class AuthHttpClient {
	public getProfileResponse(...params: DropFirst<Parameters<Axios["get"]>>) {
		return axios.get<UserDto>(`${AUTH_ENDPOINT_PREFIX}/${AuthEndpoints.PROFILE}`, ...params);
	}

	public loginResponse(...params: DropFirst<Parameters<Axios["post"]>>) {
		return axios.post<AuthSuccessDto>(
			`${AUTH_ENDPOINT_PREFIX}/${AuthEndpoints.LOGIN}`,
			...params
		);
	}
	public login(...params: DropFirst<Parameters<Axios["post"]>>) {
		return this.loginResponse(...params).then(({ data }) => data);
	}

	public refreshResponse(...params: DropFirst<Parameters<Axios["post"]>>) {
		return axios.post<AuthSuccessDto>(
			`${AUTH_ENDPOINT_PREFIX}/${AuthEndpoints.REFRESH}`,
			...params
		);
	}
	public refresh(...params: DropFirst<Parameters<Axios["post"]>>) {
		return this.refreshResponse(...params).then(({ data }) => data);
	}
}
