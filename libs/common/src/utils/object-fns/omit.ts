/**
 * Omits some keys from an object.
 *
 * @example ```typescript
 * omit({ p0: 0, p1: 1 }, ["p1", "p2"]); // { p0: 1 }
 * ```
 * @param object The objet to omit the keys from
 * @param keys The keys to omit
 * @returns A shallow copy of the object without the keys
 */
export function omit<T extends object, K extends keyof T>(
	object: T,
	keys: readonly K[]
): Omit<T, (typeof keys)[number]> {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !keys.includes(key as K))
	) as Omit<T, (typeof keys)[number]>;
}
