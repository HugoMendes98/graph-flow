import { EntityFilter } from "./entity-filter.types";
import { EntityOrder } from "./entity-order.types";
import { type FindResultsDto } from "../dtos/find-results.dto";

/**
 * Parameters when looking for entities
 */
export interface EntityFindParams<T> {
	/**
	 * Limit the number of entities returned.
	 *
	 * Use `0` to count only.
	 */
	limit?: number;
	/**
	 * Order the entities.
	 *
	 * The order of the array defines the ordering.
	 */
	order?: ReadonlyArray<EntityOrder<T>>;
	/**
	 * Skip some entities
	 */
	skip?: number;
}

/**
 * Parameters when looking and filtering entities
 */
export interface EntityFindQuery<T> extends EntityFindParams<T> {
	/**
	 * Filter the entities
	 */
	where?: EntityFilter<T>;
}

export type EntityFindResult<T> = FindResultsDto<T>;
