import type { Collection } from "@mikro-orm/core";

import { EntityDto } from "./entity.dto";

/**
 * Transforms a DTO to its Entity form
 */
export type DtoToEntity<T> = {
	[K in keyof T]: NonNullable<T[K]> extends ReadonlyArray<
		infer U extends EntityDto
	>
		? Collection<DtoToEntity<U>>
		: NonNullable<T[K]> extends EntityDto
		? DtoToEntity<NonNullable<T[K]>> | Extract<T[K], null>
		: T[K];
};
