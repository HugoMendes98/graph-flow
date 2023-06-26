import type { Type } from "@nestjs/common";

export type DtoPropertyKey = string | symbol;
export type DtoType = Type<unknown>;

/**
 * Options to store metadata property options
 */
export interface DtoPropertyOptions {
	/**
	 * Does currently nothing
	 *
	 * @default false
	 */
	array?: boolean;
	/**
	 * Allows to refer to references which are not yet defined.
	 * Same purpose as `forwardRef` in Angular or NestJS.
	 *
	 * Do not determine the type immediately when setting to other decorators.
	 * Use this for bidirectional classes.
	 *
	 * @example ```typescript
	 * class A {
	 *     \@DtoProperty({ lazy: true, type: () => B })
	 *     public property: B;
	 * }
	 * class B {
	 *     \@DtoProperty({ lazy: true, type: () => A })
	 *     public property: A;
	 * }
	 * ```
	 */
	forwardRef?: boolean;
	/**
	 * Does currently nothing
	 */
	nullable?: boolean;
	/**
	 * The type of the property.
	 * To use when the field is an array or nullable.
	 */
	type?: () => DtoType;
}
