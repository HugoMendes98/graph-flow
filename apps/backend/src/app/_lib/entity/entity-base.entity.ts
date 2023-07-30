import { PrimaryKey, Property, wrap } from "@mikro-orm/core";
import { EntityDto } from "~/lib/common/dtos/entity";

import { EntityToDto } from "./entity.types";

/**
 * Base entity for Mikro-orm
 */
export abstract class EntityBase implements EntityDto {
	/**
	 * The unique ID of the entity
	 */
	@PrimaryKey({ autoincrement: true })
	public readonly _id!: number;

	/**
	 * The date when this entity has been created
	 */
	@Property({ defaultRaw: "NOW()" })
	public readonly _created_at!: Date;

	/**
	 * The date when this entity has been updated
	 */
	@Property({
		defaultRaw: "NOW()",
		onUpdate: () => {
			const now = new Date();
			// The milliseconds are not stored,
			//	so set to 0 when serializing
			now.setMilliseconds(0);
			return now;
		}
	})
	public readonly _updated_at!: Date;

	/**
	 * Transforms this entity to a JSON encoding.
	 *
	 * @returns The entity as supposed to be from the DTO
	 */
	public toJSON?(): EntityToDto<this> {
		const wrapped = wrap(this, true);
		const toHide: string[] = Object.values(wrapped.__meta.properties)
			.filter(({ hidden }) => hidden)
			.map(({ name }) => name);

		// For a reason, the serialization of mikro-orm remove properties that starts with '_',
		//	so the use of `POJO` instead of `JSON`
		const pojo = wrapped.toPOJO();

		return Object.fromEntries(
			Object.entries(pojo).filter(([key]) => !toHide.includes(key))
		) as unknown as EntityToDto<this>;
	}
}
