import type { Collection } from "@mikro-orm/core";

import { EntityDto } from "./entity.dto";

/**
 * Transforms a DTO to its Entity form
 */
export type DtoToEntity<T extends EntityDto> = {
	[K in keyof T]: NonNullable<T[K]> extends Array<infer U extends EntityDto>
		? Collection<DtoToEntity<U>>
		: NonNullable<T[K]> extends EntityDto
		? DtoToEntity<NonNullable<T[K]>>
		: T[K];
};
