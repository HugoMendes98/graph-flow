import { Collection } from "@mikro-orm/core";
import { ConditionalKeys, ConditionalPick } from "type-fest";
import { EntityDto } from "~/lib/common/dtos/_lib/entity";

import { EntityBase } from "./entity-base.entity";

/**
 * Transforms entity with array relations to Mikro-orm collection,
 * so the fields can be ordered or filtered.
 */
export type EntityWithRelations<
	T extends EntityDto,
	Relations extends Partial<Record<keyof T, EntityBase>> = never
> = {
	/* eslint-disable no-mixed-spaces-and-tabs -- prettier format */
	// If the property is an array of entity -> convert to Mikro-orm collection
	[P in keyof T]: NonNullable<T[P]> extends Collection<infer U>
		? Collection<Relations[P] extends EntityBase ? Relations[P] : U>
		: NonNullable<T[P]> extends EntityDto[]
		? // Allow to override the type with the given options
		  Collection<Relations[P] extends EntityBase ? Relations[P] : EntityBase>
		: // Else if the property is an entity
		NonNullable<T[P]> extends EntityDto
		? // Allow to override the type with the given options
		  Relations[P] extends EntityBase
			? Relations[P]
			: EntityBase
		: T[P];
	/* eslint-enable */
};

// TODO: the 2 following types are incomplete (and might be wrong).
/**
 * Transforms a backend entity to its Dto form
 */
export type EntityToDto<T extends EntityBase> = {
	[K in keyof T]: T[K] extends Collection<infer U> ? U[] : T[K];
};

/**
 * Transforms a dto to its Entity form
 */
export type DtoToEntity<T extends EntityBase> = {
	[K in keyof T]: T[K] extends Array<infer U extends EntityDto> ? Collection<U> : T[K];
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
