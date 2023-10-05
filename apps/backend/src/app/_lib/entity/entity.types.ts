import { Collection } from "@mikro-orm/core";
import { EntityRelationKeys } from "~/lib/common/endpoints";

import { EntityBase } from "./entity-base.entity";

// TODO: the following type is incomplete (and might be wrong).
/**
 * Transforms a backend entity to its DTO form
 */
export type EntityToDto<T extends EntityBase> = {
	[K in keyof T]: T[K] extends Collection<infer U> ? U[] : T[K];
};

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
					[K in EntityRelationKeys<T>]: NonNullable<T[K]> extends infer U extends
						EntityBase
						? `${K}.${EntityRelationKeysDeep<U, Depth[D]>}`
						: NonNullable<T[K]> extends Collection<infer U extends EntityBase>
						? `${K}.${EntityRelationKeysDeep<U, Depth[D]>}`
						: NonNullable<T[K]> extends Array<infer U extends EntityBase>
						? `${K}.${EntityRelationKeysDeep<U, Depth[D]>}`
						: never;
			  }[EntityRelationKeys<T>]);
