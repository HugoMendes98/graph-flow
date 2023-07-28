import { Injectable } from "@angular/core";
import * as qs from "qs/lib/stringify";
import { Jsonify } from "type-fest";
import { EntityDto, EntityId } from "~/lib/common/dtos/_lib/entity";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import {
	EntityFindQuery,
	EntityFindResult
} from "~/lib/common/endpoints/_lib/entity-find.interfaces";
import { EntityEndpoint } from "~/lib/common/endpoints/_lib/entity.endpoint";

import { ApiClient } from "../../api.client";

@Injectable({
	providedIn: "root"
})
export abstract class EntityApiService<
	T extends DtoToEntity<EntityDto> | Jsonify<EntityDto>,
	ToCreate,
	ToUpdate,
	Q extends EntityFindQuery<T> = EntityFindQuery<T>
> implements EntityEndpoint<T, ToCreate, ToUpdate, Q>
{
	public constructor(protected readonly client: ApiClient) {}

	/**
	 * Get the entrypoint from the api url.
	 *
	 * Given the api url 'http://localhost:3000/api',
	 * if the final url is 'http://localhost:3000/api/v2/bars', the entrypoint is '/v2/bars'
	 */
	public abstract getEntrypoint(): string;

	/**
	 * Counts the number of entities with the given filter
	 *
	 * @param where The filter to apply
	 * @returns The number of entities found
	 */
	public count(where?: Q["where"]): Promise<number> {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Subtype constraint
		return this.findAndCount({ limit: 0, where } as Q).then(
			({ pagination: { total } }) => total
		);
	}

	/**
	 * Finds entities with the given filter and order
	 *
	 * @param query Filter, sort and/or paginate the results
	 * @returns The results of the request
	 */
	public findAndCount(query?: Q): Promise<EntityFindResult<T>> {
		let url = this.getEntrypoint();
		if (query) {
			const queryString = qs.stringify(query);
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		return this.client.get(url);
	}

	/**
	 * Finds one entity.
	 *
	 * @param id Of the entity to find
	 * @returns The entity found
	 */
	public findById(id: EntityId): Promise<T> {
		return this.client.get(`${this.getEntrypoint()}/${id}`);
	}

	/**
	 * Creates an entity.
	 *
	 * @param body Object to create an entity
	 * @returns the created entity
	 */
	public create(body: ToCreate): Promise<T> {
		return this.client.post(this.getEntrypoint(), body);
	}

	/**
	 * Updates an entity.
	 *
	 * @param id The id of the entity to update
	 * @param body Object to update an entity
	 * @returns the updated entity
	 */
	public update(id: EntityId, body: ToUpdate): Promise<T> {
		return this.client.patch(`${this.getEntrypoint()}/${id}`, body);
	}

	/**
	 * Deletes an entity.
	 *
	 * @param id The id of the entity to delete
	 * @throws An error when the element to delete is not found
	 * @returns The just deleted entity
	 */
	public delete(id: EntityId): Promise<T> {
		return this.client.delete(`${this.getEntrypoint()}/${id}`);
	}
}
