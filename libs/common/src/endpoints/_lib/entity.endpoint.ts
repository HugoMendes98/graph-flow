import { Jsonify } from "type-fest";

import { EntityFindQuery, EntityFindResult } from "./entity-find.interfaces";
import { EntityDto, EntityId } from "../../dtos/_lib/entity";
import { DtoToEntity } from "../../dtos/_lib/entity/entity.types";

/**
 * Endpoints for entities with only read methods
 */
export interface EntityReadEndpoint<
	T extends DtoToEntity<EntityDto> | Jsonify<EntityDto>,
	Q extends EntityFindQuery<T> = EntityFindQuery<T>
> {
	/**
	 * Find entities with the given query.
	 *
	 * @param query The query url used to filter/paginate the results
	 */
	findAndCount(query?: Q): Promise<EntityFindResult<T>>;
	/**
	 * Find an entity given its ID.
	 *
	 * @throws An error when the element to delete is not found
	 * @returns The entity found
	 */
	findById(id: EntityId): Promise<T>;
}

/**
 * CRUD for regular entity endpoints
 */
export interface EntityEndpoint<
	T extends DtoToEntity<EntityDto> | Jsonify<EntityDto>,
	ToCreate,
	ToUpdate,
	Q extends EntityFindQuery<T> = EntityFindQuery<T>
> extends EntityReadEndpoint<T, Q> {
	/**
	 * Creates an entity with the given body.
	 *
	 * @returns The just created entity
	 */
	create(body: ToCreate): Promise<T>;
	/**
	 * Deleted an entity.
	 *
	 * @param id The id of the entity to delete
	 * @throws An error when the element to delete is not found
	 * @returns The just deleted entity
	 */
	delete(id: EntityId): Promise<T>;
	/**
	 * Updates an entity, which id is set, with the given body.
	 *
	 * The update is a PATCH -> Merge the values.
	 */
	update(id: EntityId, body: ToUpdate): Promise<T>;
}
