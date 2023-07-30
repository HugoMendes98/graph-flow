import { IsDate, IsNumber } from "class-validator";

import { DtoProperty } from "../dto";

export type EntityId = number;

/**
 * Base DTO for all entities
 */
export abstract class EntityDto {
	/**
	 * Unique ID defining an entity
	 */
	@DtoProperty()
	@IsNumber()
	public readonly _id!: EntityId;
	/**
	 * The date when this entity has been created
	 */
	@DtoProperty()
	@IsDate()
	public readonly _created_at!: Date;
	/**
	 * The date when this entity has been updated
	 */
	@DtoProperty()
	@IsDate()
	public readonly _updated_at!: Date;
}

/**
 * The keys of the [EntityDto]{@link EntityDto}
 */
export const ENTITY_BASE_KEYS = [
	"_id",
	"_created_at",
	"_updated_at"
] as const satisfies ReadonlyArray<keyof EntityDto>;
