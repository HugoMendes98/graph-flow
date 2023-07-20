import { Collection } from "@mikro-orm/core";
import { EntityDto } from "~/lib/common/dtos/_lib/entity";

/**
 * Transforms entity with array relations to Mikro-orm collection,
 * so the fields can be ordered or filtered.
 */
export type EntityWithRelations<T extends EntityDto> = {
	[P in keyof T]: NonNullable<T[P]> extends Array<infer U extends EntityDto>
		? Collection<U>
		: T[P];
};
