import type { Collection } from "@mikro-orm/core";
import { ConditionalKeys } from "type-fest";

import { EntityDto } from "../dtos/entity";

/**
 * Extract the keys for relations from the given entity
 */
export type EntityRelationKeys<T extends EntityDto> = Exclude<
	| ConditionalKeys<
			Required<T>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Anything other than `any` fails the condition
			Collection<any>
	  >
	| ConditionalKeys<Required<T>, EntityDto | null>
	| ConditionalKeys<Required<T>, EntityDto[]>
	| ConditionalKeys<Required<T>, EntityDto>,
	symbol
>;

/**
 * The nested entities to populate when loading an entity
 */
export type EntitiesToPopulate<T extends EntityDto> = {
	[K in EntityRelationKeys<T>]?:
		| true // Set an entity relation to populate
		// Set an entity to populate and some nested entities
		| (Required<T>[K] extends infer U extends EntityDto | null
				? EntitiesToPopulate<NonNullable<U>>
				: // Mikro-orm Collection
				NonNullable<T[K]> extends Collection<infer U extends EntityDto>
				? EntitiesToPopulate<U>
				: // DTO arrays
				NonNullable<T[K]> extends Array<infer U extends EntityDto>
				? EntitiesToPopulate<U>
				: never);
};

/**
 * The entity with its loaded nested entities
 */
export type EntityPopulated<T extends EntityDto, P extends EntitiesToPopulate<T> = never> = T & {
	[K in keyof P & keyof T]: P[K] extends true
		? Required<T>[K]
		: // Nested entities (can still be `null` for nullable relations)
		NonNullable<T[K]> extends infer U extends EntityDto
		? P[K] extends EntitiesToPopulate<U>
			? EntityPopulated<U, P[K]> & Required<T[K]>
			: U
		: // Mikro-orm Collection
		NonNullable<T[K]> extends Collection<infer U extends EntityDto>
		? Collection<P[K] extends EntitiesToPopulate<U> ? EntityPopulated<U, P[K]> & U : U>
		: // DTO arrays
		NonNullable<T[K]> extends Array<infer U extends EntityDto>
		? Array<P[K] extends EntitiesToPopulate<U> ? EntityPopulated<U, P[K]> & U : U>
		: never;
};
