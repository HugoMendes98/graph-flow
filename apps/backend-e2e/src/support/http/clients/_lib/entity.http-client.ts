import axios, { Axios, AxiosHeaders } from "axios";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";
import { EntityId } from "~/lib/common/dtos/entity";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import { DropFirst } from "~/lib/common/types";

import { AuthHttpClient } from "../auth.http-client";

/**
 * This is (almost) only a helper for the entrypoint string.
 *
 * Do not overkill this class or its children,
 * they only are for testing purpose,
 * not to replace the reals API clients.
 */
export abstract class EntityHttpClient<T> {
	protected client!: Axios;

	public constructor() {
		this.removeAuth();
	}

	/**
	 * @returns the endpoint
	 */
	public abstract getEndpoint(): string;

	public findManyResponse(...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.client.get<FindResultsDto<T>>(this.getEndpoint(), ...params);
	}
	public findMany(...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.findManyResponse(...params).then(({ data }) => data);
	}

	public findOneResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.client.get<T>(`${this.getEndpoint()}/${id}`, ...params);
	}
	public findOne(id: EntityId, ...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.findOneResponse(id, ...params).then(({ data }) => data);
	}

	public createResponse(...params: DropFirst<Parameters<Axios["post"]>>) {
		return this.client.post<T>(this.getEndpoint(), ...params);
	}
	public create(...params: DropFirst<Parameters<Axios["post"]>>) {
		return this.createResponse(...params).then(({ data }) => data);
	}

	public updateResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["patch"]>>) {
		return this.client.patch<T>(`${this.getEndpoint()}/${id}`, ...params);
	}
	public update(id: EntityId, ...params: DropFirst<Parameters<Axios["patch"]>>) {
		return this.updateResponse(id, ...params).then(({ data }) => data);
	}

	public deleteResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["delete"]>>) {
		return this.client.delete<T>(`${this.getEndpoint()}/${id}`, ...params);
	}
	public delete(id: EntityId, ...params: DropFirst<Parameters<Axios["delete"]>>) {
		return this.deleteResponse(id, ...params).then(({ data }) => data);
	}

	public async setAuth(email: string, password: string) {
		const { access_token } = await new AuthHttpClient().login({
			email,
			password
		} satisfies AuthLoginDto);

		this.setAuthToken(access_token);
		return access_token;
	}

	public setAuthToken(token: string) {
		this.client = axios.create({
			headers: new AxiosHeaders().setAuthorization(`Bearer ${token}`)
		});
	}

	public removeAuth() {
		this.client = axios.create();
	}
}
