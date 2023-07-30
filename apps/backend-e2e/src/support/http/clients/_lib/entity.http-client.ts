import axios, { Axios } from "axios";
import { Jsonify } from "type-fest";
import { EntityId } from "~/lib/common/dtos/entity";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import { DropFirst } from "~/lib/common/types";

/**
 * This is (almost) only a helper for the entrypoint string.
 *
 * Do not overkill this class or its children,
 * they only are for testing purpose,
 * not to replace the reals API clients.
 */
export abstract class EntityHttpClient<T> {
	/**
	 * @returns the endpoint
	 */
	public abstract getEndpoint(): string;

	public findManyResponse(...params: DropFirst<Parameters<Axios["get"]>>) {
		return axios.get<Jsonify<FindResultsDto<T>>>(this.getEndpoint(), ...params);
	}
	public findMany(...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.findManyResponse(...params).then(({ data }) => data);
	}

	public findOneResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["get"]>>) {
		return axios.get<Jsonify<T>>(`${this.getEndpoint()}/${id}`, ...params);
	}
	public findOne(id: EntityId, ...params: DropFirst<Parameters<Axios["get"]>>) {
		return this.findOneResponse(id, ...params).then(({ data }) => data);
	}

	public createResponse(...params: DropFirst<Parameters<Axios["post"]>>) {
		return axios.post<Jsonify<T>>(this.getEndpoint(), ...params);
	}
	public create(...params: DropFirst<Parameters<Axios["post"]>>) {
		return this.createResponse(...params).then(({ data }) => data);
	}

	public updateResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["patch"]>>) {
		return axios.patch<Jsonify<T>>(`${this.getEndpoint()}/${id}`, ...params);
	}

	public update(id: EntityId, ...params: DropFirst<Parameters<Axios["patch"]>>) {
		return this.updateResponse(id, ...params).then(({ data }) => data);
	}

	public deleteResponse(id: EntityId, ...params: DropFirst<Parameters<Axios["delete"]>>) {
		return axios.delete<Jsonify<T>>(`${this.getEndpoint()}/${id}`, ...params);
	}

	public delete(id: EntityId, ...params: DropFirst<Parameters<Axios["delete"]>>) {
		return this.deleteResponse(id, ...params).then(({ data }) => data);
	}

	// TODO: auth
}
