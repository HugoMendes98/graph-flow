import { Collection } from "@mikro-orm/core";
import { ConditionalKeys, ConditionalPick } from "type-fest";

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
export type EntityRelationsKeys<T extends EntityBase> = ConditionalKeys<
	Required<T>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Anything other than `any` fails the condition
	Collection<any>
> &
	ConditionalPick<Required<T>, EntityBase>;
