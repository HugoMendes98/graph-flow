import { type Collection } from "@mikro-orm/core";
import { ExcludeFunctions, OperatorMap } from "@mikro-orm/core/typings";

export type EntityFilterValue<T> = Omit<
	OperatorMap<T>,
	"$and" | "$not" | "$or"
>;

export type EntityFilterObject<T> = {
	[P in keyof T as ExcludeFunctions<T, P>]?: T[P] extends Date
		? EntityFilterValue<T[P]> | T[P]
		: // Nest array of objects
			NonNullable<T[P]> extends ReadonlyArray<infer U>
			? EntityFilterObject<U>
			: // Compatibility for backend (Mikro-orm Collection)
				NonNullable<T[P]> extends Collection<infer U>
				? EntityFilterObject<U>
				: NonNullable<T[P]> extends object
					? EntityFilterObject<T[P]>
					: EntityFilterValue<T[P]> | T[P];
};

/**
 * Possible Logical operators for an entity
 */
export interface EntityFilterLogicalOperators<T> {
	/**
	 * All items are `AND` conditions
	 *
	 * @example ```typescript
	 * const conditions: $and<EntityFilter<{ a: number }>> = [{ a: 2 }, { b: 5 }];
	 * // => entity.a === 2 && entity.a === 5
	 * ```
	 */
	$and?: ReadonlyArray<EntityFilter<T>>;
	/**
	 * Negate condition
	 */
	$not?: EntityFilter<T>;
	/**
	 * All items are `OR` conditions
	 *
	 * @example ```typescript
	 * const conditions: $or<EntityFilter<{ a: number }>> = [{ a: 2 }, { b: 5 }];
	 * // => entity.a === 2 || entity.a === 5
	 * ```
	 */
	$or?: ReadonlyArray<EntityFilter<T>>;
}

export type EntityFilter<T> = EntityFilterLogicalOperators<T> &
	EntityFilterObject<T>;
