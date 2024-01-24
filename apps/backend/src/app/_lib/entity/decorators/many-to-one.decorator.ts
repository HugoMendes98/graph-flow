import { ManyToOne, ManyToOneOptions } from "@mikro-orm/core";
import { applyDecorators } from "@nestjs/common";

export type ManyToOneFactoryOptions<T, O> = Omit<
	ManyToOneOptions<T, O>,
	"entity" | "fieldName" | "persist" | "type"
> &
	Pick<Required<ManyToOneOptions<T, O>>, "fieldName">;

/**
 * The parameters for the [manyToOne]{@link ManyToOneFactory} decorator
 */
export interface ManyToOneParams {
	/**
	 * Is this property the foreign relation.
	 *
	 * @example ```
	 * class Base {
	 *   // The property stored in a row of the table
	 *   \@ManyToOneProperty({ foreign: false })
	 * 	 public __entity: number = 0:
	 * 	 // The data of the relation
	 *   \@ManyToOneProperty({ foreign: true })
	 *   public entity: Entity = {};
	 * }
	 * ```
	 */
	foreign: boolean;
}

export type ManyToOnePropertyOptions<T, O> = ManyToOneFactoryOptions<T, O> &
	ManyToOneParams;

/**
 * Decorator for relations. It manages two properties for the same fieldName.
 * To keep the foreign key as the trust source, but allows the relation for filters.
 *
 * @param entity The entity of the relation
 * @param options `ManyToOne` Options
 * @returns the decorator
 */
export function ManyToOneProperty<T, O>(
	entity: Required<ManyToOneOptions<T, O>>["entity"],
	options: ManyToOnePropertyOptions<T, O>
): PropertyDecorator {
	const { foreign, ...mtoOptions } = options;

	return applyDecorators(
		ManyToOne(entity, {
			eager: false,
			hidden: foreign,
			mapToPk: !foreign,
			...mtoOptions,
			persist: !foreign
		}) as never
	);
}

/**
 * Factories a decorator, so ony the options are only defined.
 *
 * @param entity The entity of the relation
 * @param options `ManyToOne` Options
 * @returns The decorator factory
 */
export function ManyToOneFactory<T, O>(
	entity: Required<ManyToOneOptions<T, O>>["entity"],
	options: ManyToOneFactoryOptions<T, O>
): (params: ManyToOneParams) => PropertyDecorator {
	return params => ManyToOneProperty(entity, { ...options, ...params });
}
