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
	K extends Partial<Record<keyof T, EntityBase>> = never
> = {
	[P in keyof T]: NonNullable<T[P]> extends EntityDto[]
		? Collection<K[P] extends EntityBase ? K[P] : EntityBase>
		: T[P];
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
