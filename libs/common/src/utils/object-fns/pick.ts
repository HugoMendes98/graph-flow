import { ReadonlyDeep } from "type-fest";

/**
 * Picks some keys from an object.
 *
 * @example ```typescript
 * pick({ p0: 0, p1: 1 }, ["p1", "p2"]); // { p1: 1 }
 * ```
 * @param object The objet to pick the keys from
 * @param keys The keys to pick
 * @returns A shallow copy of the object with the wanted keys
 */
export function pick<T extends object, K extends keyof T>(
	object: ReadonlyDeep<T>,
	keys: readonly K[]
): Pick<T, (typeof keys)[number]> {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => keys.includes(key as K))
	) as Pick<T, (typeof keys)[number]>;
}
