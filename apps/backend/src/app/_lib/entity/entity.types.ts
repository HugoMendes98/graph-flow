import { Collection } from "@mikro-orm/core";
import { ConditionalKeys } from "type-fest";

import { EntityBase } from "./entity-base.entity";

// TODO: the following type is incomplete (and might be wrong).
/**
 * Transforms a backend entity to its DTO form
 */
export type EntityToDto<T extends EntityBase> = {
	[K in keyof T]: T[K] extends Collection<infer U> ? U[] : T[K];
};

/**
 * Extract the keys for relations from the given entity
 */
export type EntityRelationKeys<T extends EntityBase> = Exclude<
	| ConditionalKeys<
			Required<T>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Anything other than `any` fails the condition
			Collection<any>
	  >
	| ConditionalKeys<Required<T>, EntityBase | null>
	| ConditionalKeys<Required<T>, EntityBase>,
	symbol
>;

/**
 * The maximum depth of type.
 * Avoid `type instantiation is excessively deep and possibly infinite`
 */
type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7];

/**
 * Same as {@link EntityRelationKeys} but with a deep search
 *
 * @see EntityRelationKeys
 */
export type EntityRelationKeysDeep<T extends EntityBase, D extends Depth[number] = 5> =
	| EntityRelationKeys<T>
	| (D extends never
			? never
			: {
					[K in EntityRelationKeys<T>]: Required<T>[K] extends EntityBase
						? `${K}.${EntityRelationKeysDeep<Required<T>[K], Depth[D]>}`
						: Required<T>[K] extends Collection<infer U extends EntityBase>
						? `${K}.${EntityRelationKeysDeep<U, Depth[D]>}`
						: never;
			  }[EntityRelationKeys<T>]);
