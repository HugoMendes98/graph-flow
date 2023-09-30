import type { ExposeOptions } from "class-transformer";
import { AbstractClass, Class } from "type-fest";

export type DtoPropertyKey = string | symbol;
export type DtoType<T = unknown> = AbstractClass<T> | Class<T>;

/**
 * The type is very similar from the `class-transformer` one.
 * The following comments are taken from its source code.
 *
 * Discriminator object containing the type information to select a proper type
 * during transformation when a discriminator property is provided.
 */
export interface DtoDiscriminator<T extends object, P extends Extract<keyof T, string>> {
	/**
	 * The name of the property which holds the type information in the received object.
	 */
	property: P;
	/**
	 * List of the available types. The transformer will try to lookup the object
	 * with the same key as the value received in the defined discriminator property
	 * and create an instance of the defined class.
	 */
	subTypes: Array<{
		/**
		 * Name of the type.
		 */
		name: Extract<T[P], string>;
		/**
		 * A class constructor which can be used to create the object.
		 */
		value: DtoType<T>;
	}>;
}

/**
 * Options to store metadata property options
 */
export interface DtoPropertyOptions<T = never, P extends Extract<keyof T, string> = never> {
	/**
	 * Does currently nothing
	 *
	 * @default false
	 */
	array?: boolean;
	/**
	 * Mostly the same idea as its `class-transformer` counterpart.
	 *
	 * Discriminator is used by:
	 * - Transformation: passed to `class-transformer`
	 * - Order: define valid properties. It can not narrow which ones though.
	 * - Where: If the property is set, narrow to the correct type (when explicit, `type: 2` or `type: { $eq: 2 }` )
	 *
	 * /!\ Only works with manual `type` and an object type
	 */
	discriminator?: T extends object ? DtoDiscriminator<T, P> : never;
	/**
	 * Should expose this property to `class-transformer`.
	 *
	 * By default, a `Expose` decorator is added
	 *
	 * @default true
	 */
	expose?: ExposeOptions | boolean;
	/**
	 * Does currently nothing
	 */
	nullable?: boolean;
	/**
	 * The type of the property.
	 * To use when the field is an array, nullable, `forwardRef` (circular) or discriminated.
	 *
	 * /!\ It is only calculated once (~= singleton)
	 */
	type?: () => DtoType<T> | null;
}
