import { EntityFindQuery, EntityFindResult } from "./entity-find.interfaces";
import { EntityId } from "../../dtos/_lib/entity";

/**
 * CRUD for basic entity endpoints
 */
export interface EntityEndpoint<T, ToCreate, ToUpdate, Q extends T = T> {
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
	 * Find entities with the given parameters.
	 *
	 * @param query The query url used to filter/paginate the results
	 */
	findAndCount(query?: EntityFindQuery<Q>): Promise<EntityFindResult<T>>;
	/**
	 * Find an entity given its ID.
	 *
	 * @throws An error when the element to delete is not found
	 * @returns The entity found
	 */
	findById(id: EntityId): Promise<T>;
	/**
	 * Updates an entity, which id is set, with the given body.
	 *
	 * The update is a PATCH -> Merge the values.
	 */
	update(id: EntityId, body: ToUpdate): Promise<T>;
}
