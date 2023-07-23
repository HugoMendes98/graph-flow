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
	/* eslint-disable no-mixed-spaces-and-tabs -- For the prettier format */
	// If the property is an array of entity -> convert to Mikro-orm collection
	[P in keyof T]: NonNullable<T[P]> extends EntityDto[]
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

/**
 * Extract the keys for relations from the given entity
 */
export type EntityRelationsKeys<T extends EntityBase> = ConditionalKeys<
	Required<T>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Anything other than `any` fails the condition
	Collection<any>
> &
	ConditionalPick<Required<T>, EntityBase>;
