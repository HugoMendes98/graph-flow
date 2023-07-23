import { EntityRepository, FilterQuery, wrap } from "@mikro-orm/core";
import { instanceToPlain } from "class-transformer";
import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { FindResultsDto } from "~/lib/common/dtos/_lib/find-results.dto";
import { EntityFindParams, EntityFilter } from "~/lib/common/endpoints/_lib";
import { transformOptions } from "~/lib/common/options";

import { EntityBase } from "./entity-base.entity";
import { entityOrderToQueryOrder } from "./entity-order.converter";
import { EntityRelationsKeys } from "./entity.types";

/**
 * Some options when finding entities
 */
export interface EntityServiceFindOptions<T extends EntityBase, P extends EntityRelationsKeys<T>> {
	/**
	 * Populate the given relation keys
	 */
	populate?: P[];
}

/**
 * The options when creating an entity
 */
export interface EntityServiceCreateOptions {
	/**
	 * Disable this when doing multiple operations,
	 * so all of them are on 1 transaction
	 *
	 * @default true
	 */
	flush?: boolean;
}

type EntityServiceCreateOptionsNoFlush = EntityServiceCreateOptions &
	Record<keyof Pick<EntityServiceCreateOptions, "flush">, false>;

export type EntityServiceUpdateOptions = EntityServiceCreateOptions;
export type EntityServiceDeleteOptions = EntityServiceCreateOptions;

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
	 * Find many entities and count them
	 *
	 * @param where Filter to apply
	 * @param params Additional parameters to sort and/or paginate
	 * @param options Some options when loading an entities
	 * @returns All entities found with its pagination
	 */
	public findAndCount<P extends EntityRelationsKeys<T>>(
		where: EntityFilter<T> = {},
		params: EntityFindParams<T> = {},
		options?: EntityServiceFindOptions<T, P>
	): Promise<FindResultsDto<Required<Pick<T, P>> & T>> {
		// TODO: fix order by foreign of foreign id
		const offset = params.skip ?? 0;
		return (
			this.repository
				// TODO: should probably not convert here
				//	https://mikro-orm.io/docs/entity-helper#using-class-based-data
				.findAndCount(instanceToPlain(where, transformOptions), {
					limit: params.limit,
					offset,
					orderBy: params.order?.map(entityOrderToQueryOrder),
					populate: options?.populate as never
				})
				.then(([data, total]) => ({
					data: data as Array<Required<Pick<T, P>> & T>,
					pagination: { range: { end: offset + data.length, start: offset }, total }
				}))
		);
	}

	/**
	 * Count entities
	 *
	 * @param where Filter to apply
	 * @returns The count of the entities found
	 */
	public count(where: EntityFilter<T> = {}) {
		return this.findAndCount(where, { limit: 0 }).then(({ pagination: { total } }) => total);
	}

	/**
	 * Find one entity by its id
	 *
	 * @param id Entity id to find
	 * @param options Some options when loading an entity
	 * @returns The found entity
	 */
	public findById<P extends EntityRelationsKeys<T>>(
		id: EntityId,
		options?: EntityServiceFindOptions<T, P>
	) {
		return this.repository.findOneOrFail(
			{
				_id: { $eq: id }
				// It seems there's an error when using calculated generic type
			} satisfies FilterQuery<EntityBase> as FilterQuery<T>,
			{ populate: options?.populate as never }
		) as Promise<Required<Pick<T, P>> & T>;
	}

	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @param options Additional options when creating an entity
	 * @returns The created entity not persisted in the Database
	 */
	public create(
		toCreate: ToCreate,
		options: EntityServiceCreateOptionsNoFlush
	): Promise<ToCreate>;
	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @param options Additional options when creating an entity
	 * @returns The created entity
	 */
	public create(toCreate: ToCreate, options?: EntityServiceCreateOptions): Promise<T>;

	/**
	 * Creates a new entity
	 *
	 * @param toCreate Object to create
	 * @param options Additional options when creating an entity
	 * @returns The created entity not persisted in the Database or the persisted one
	 */
	public async create(
		toCreate: ToCreate,
		options?: EntityServiceCreateOptions
	): Promise<T | ToCreate> {
		// Why as never? Mikro-orm detect optional props by `?`
		//	But it does take account of SQL default value
		const created = this.repository.create(toCreate as never, { persist: true });
		if (options?.flush ?? true) {
			await this.repository.getEntityManager().flush();
		}

		return created;
	}

	/**
	 * Updates an existing entity
	 *
	 * @param id Entity id to update
	 * @param toUpdate Object to update
	 * @param options Additional options when updating an entity
	 * @returns The updated entity
	 */
	public async update(
		id: EntityId,
		toUpdate: ToUpdate,
		options?: EntityServiceUpdateOptions
	): Promise<T> {
		return this.findById(id).then(async entity => {
			// TODO: remove the `instanceToPlain`
			//	https://mikro-orm.io/docs/entity-helper#using-class-based-data
			wrap(entity).assign(instanceToPlain(toUpdate), {
				mergeObjects: true
			});

			if (options?.flush ?? true) {
				await this.repository.getEntityManager().flush();
			}

			// The return value will be up-to-date if flushed
			return entity;
		});
	}

	/**
	 * Deletes an existing entity
	 *
	 * @param id Entity id to delete
	 * @param options Additional options when deleting an entity
	 * @returns The deleted entity
	 */
	public delete(id: EntityId, options?: EntityServiceDeleteOptions): Promise<T> {
		return this.findById(id).then(async entity => {
			this.repository.getEntityManager().remove(entity);

			if (options?.flush ?? true) {
				await this.repository.getEntityManager().flush();
			}

			return entity;
		});
	}
}
