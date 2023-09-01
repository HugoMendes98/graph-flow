import { EntitiesToPopulate } from "~/lib/common/endpoints";

import { EntityBase } from "./entity-base.entity";
import { EntityRelationKeysDeep } from "./entity.types";

/**
 * Converts the object to determine the entities to populate into an array of keys
 *
 * @param toPopulate the object setting the entities to populate
 * @returns to populate keys for Mikro-orm
 */
export function entityToPopulateToRelationsKeys<T extends EntityBase>(
	toPopulate: EntitiesToPopulate<T>
): Array<EntityRelationKeysDeep<T>> {
	return Object.entries<NonNullable<EntitiesToPopulate<T>[keyof EntitiesToPopulate<T>]> | true>(
		toPopulate as never
	).flatMap(([key, value]) => {
		if (value === true) {
			return [key] as never;
		}

		const keys: string[] = entityToPopulateToRelationsKeys(value);
		return (keys.length ? keys.map(nested => `${key}.${nested}`) : [key]) as never;
	});
}
