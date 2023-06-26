import { Primitive as RealPrimitive } from "type-fest";

/**
 * Return all values except first.
 *
 * @see https://stackoverflow.com/a/63029283
 */
export type DropFirst<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;

/**
 * The primitives, by this project point of view.
 */
export type Primitive = Exclude<RealPrimitive, bigint | symbol>;
