import { EntityRepository, FilterQuery } from "@mikro-orm/core";
import { EntityId } from "~/lib/common/dtos/entity";
import { FindResultsDto } from "~/lib/common/dtos/find-results.dto";
import {
	EntityFindParams,
	EntityFilter,
	EntitiesToPopulate,
	EntityPopulated
} from "~/lib/common/endpoints";

import { EntityBase } from "./entity-base.entity";
import { entityOrderToQueryOrder } from "./entity-order.converter";
import { entityToPopulateToRelationsKeys } from "./entity-to-populate.coverter";

/**
 * Some options when finding entities
 */
export interface EntityServiceFindOptions<
	T extends EntityBase,
	P extends EntitiesToPopulate<T>
> {
	/**
	 * Populate the given relations
	 */
	populate?: P;
}

/**
 * The options when creating an entity
 */
export interface EntityServiceCreateOptions<
	T extends EntityBase,
	P extends EntitiesToPopulate<T>
> {
	/**
	 * The options when returning the data
	 */
	findOptions?: EntityServiceFindOptions<T, P>;
}

export type EntityServiceUpdateOptions<
	T extends EntityBase,
	P extends EntitiesToPopulate<T>
> = EntityServiceCreateOptions<T, P>;

export type EntityLoaded<
	T extends EntityBase,
	P extends EntitiesToPopulate<T> = never
> = EntityPopulated<T, P> & Required<Pick<T, "toJSON">>;

/**
 * Base service to manage entities
 */
export abstract class EntityService<
	T extends EntityBase,
	ToCreate,
	ToUpdate,
	Repository extends EntityRepository<T> = EntityRepository<T>
> {
	/**
	 * Constructs an EntityService
	 *
	 * @param repository The repository to manage
	 */
	protected constructor(protected readonly repository: Repository) {}

	/**
	 * Clears the EntityManager ang the Unit of work
	 */
	public clearEM() {
		const em = this.repository.getEntityManager();
		em.clear();
		em.getUnitOfWork().clear();
	}

	/**
	 * Find many entities and count them
	 *
	 * @param where Filter to apply
	 * @param params Additional parameters to sort and/or paginate
	 * @param options Some options when loading an entities
	 * @returns All entities found with its pagination
	 */
	public findAndCount<P extends EntitiesToPopulate<T>>(
		where: EntityFilter<T> = {},
		params: EntityFindParams<T> = {},
		options?: EntityServiceFindOptions<T, P>
	): Promise<FindResultsDto<EntityLoaded<T, P>>> {
		// TODO: fix order by foreign of foreign id
		const offset = params.skip ?? 0;
		return this.repository
			.findAndCount(where as never, {
				limit: params.limit,
				offset,
				orderBy: params.order?.map(entityOrderToQueryOrder),
				populate:
					options?.populate &&
					(entityToPopulateToRelationsKeys(options.populate) as never)
			})
			.then(([data, total]) => ({
				data: data as Array<EntityLoaded<T, P>>,
				pagination: {
					range: { end: offset + data.length, start: offset },
					total
				}
			}));
	}

	/**
	 * Count entities
	 *
	 * @param where Filter to apply
	 * @returns The count of the entities found
	 */
	public count(where: EntityFilter<T> = {}) {
		return this.findAndCount(where, { limit: 0 }).then(
			({ pagination: { total } }) => total
		);
	}

	/**
	 * Find one entity by a filter.
	 * Throws a Mikro-orm error when not found
	 *
	 * @param where filter
	 * @param options Some options when loading an entity
	 * @returns The found entity
	 */
	public findOne<P extends EntitiesToPopulate<T>>(
		where: EntityFilter<T>,
		options?: EntityServiceFindOptions<T, P>
	) {
		return this.repository.findOneOrFail(where as never, {
			populate:
				options?.populate &&
				(entityToPopulateToRelationsKeys(options.populate) as never)
		}) as Promise<EntityLoaded<T, P>>;
	}

	/**
	 * Find one entity by its id
	 *
	 * @param id Entity id to find
	 * @param options Some options when loading an entity
	 * @returns The found entity
	 */
	public findById<P extends EntitiesToPopulate<T>>(
		id: EntityId,
		options?: EntityServiceFindOptions<T, P>
	) {
		return this.findOne<P>(
			// It seems there's an error when using calculated generic type
			{ _id: { $eq: id } } satisfies FilterQuery<EntityBase> as never,
			options
		);
	}

	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @param options Additional options when creating an entity
	 * @returns The created entity persisted in the database
	 */
	public async create<P extends EntitiesToPopulate<T>>(
		toCreate: ToCreate,
		options?: EntityServiceCreateOptions<T, P>
	) {
		// Why as never? Mikro-orm detect optional props by `?`
		//	But it does take account of SQL default value
		const created = this.repository.create(toCreate as never, {
			persist: true
		});

		await this.repository.getEntityManager().flush();

		// FIXME: a way to propagate the change to already managed collections:
		//   Load an entity with manyToMany relation and delete one value.
		//   Load an entity that was linked to the deleted entity -> the collection is still full
		this.clearEM();

		return this.findById<P>(created._id, options?.findOptions);
	}

	/**
	 * Updates an existing entity
	 *
	 * @param id Entity id to update
	 * @param toUpdate Object to update
	 * @param options Additional options when updating an entity
	 * @returns The updated entity
	 */
	public async update<P extends EntitiesToPopulate<T>>(
		id: EntityId,
		toUpdate: ToUpdate,
		options?: EntityServiceUpdateOptions<T, P>
	) {
		return this.findById(id).then(async entity => {
			await this.repository.getEntityManager().persistAndFlush(
				this.repository.assign(entity, toUpdate as never, {
					mergeObjects: true,
					// Without this, it is considered as a new entity each time
					// https://mikro-orm.io/docs/entity-helper#updating-deep-entity-graph
					updateByPrimaryKey: false
				})
			);

			// The return value will be up-to-date when flushed
			return this.findById<P>(id, options?.findOptions);
		});
	}

	/**
	 * Deletes an existing entity
	 *
	 * @param id Entity id to delete
	 * @returns The deleted entity (before deletion)
	 */
	public delete(id: EntityId): Promise<T> {
		return this.findById(id).then(async entity =>
			this.deleteEntity(entity)
		);
	}

	/**
	 * Deletes an existing entity
	 *
	 * @param entity The entity to delete
	 * @returns The given entity
	 */
	protected async deleteEntity(entity: T) {
		await this.repository.getEntityManager().removeAndFlush(entity);

		// FIXME: a way to propagate the change to already managed collections:
		//   Load an entity with manyToMany relation and delete one value.
		//   Load an entity that was linked to the deleted entity -> the collection is still full
		this.clearEM();

		return entity;
	}
}
