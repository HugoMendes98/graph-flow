// https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type
/**
 * Get all keys, even on union type
 */
export type AllKeysOf<T> = T extends T ? keyof T : never;

// Inspired from
// https://www.typescriptlang.org/play?ts=4.1.0-dev.20200921#code/C4TwDgpgBACghsAFgSQLZgDYB4AqAaKAaSggA9gIA7AEwGcoBrCEAewDMocA+KAXgCgoREuSp0otYACcAlpQDmgqAH5OAbUIBdERRr0AShADGLKdSyTZCgnEoguSoapwbtZXeICCUqXBAAZGSYsW3tHIRVhAB8oAAMAEgBvQgBfADok+CQ0TFxXAgBRUiMMAFdqCCwmVg4XLQJq9ihQtU0uLhTY8KEALmi4pNSMxKyUdGw6zQbmJsmOroioPsIlPsoIADcIKQBufn5QSFgERFweXmPs8dxpms4eGMbavYPwaFGANTgyyvxYHTE9FGZ3OShgAL0A0ScjY2yI6SSMLhhkknSUqmI7kBjBmtXCqhRwAh4mBc26kU+31Kv3yUEJDkWvSg6y2UnCa0221W-yxkKenHx6hgmnZzM5u32FRKcCk0DYpUoRmAMhYlCg8ggwBuPNEkNJ7QAFCwAEYAKz6fzAJz6MAAlDaTl8ftqYFwXkA
type DotPathImpl<T extends object, K extends keyof T> = K extends string
	?
			| K
			| (NonNullable<T[K]> extends infer U | null
					? `${K}.${DotPath<Required<U>>}`
					: never)
	: never;

/**
 * A Dot path concat the keys of an object to be available in a string.
 *
 * @example ```typescript
 * // For the interface
 * interface Example {
 *   a: { b?: { c: number; }; };
 *   x: { y: number; } | { z: string; };
 * }
 *
 * // The values are:
 * const values: Array<DotPath<AA>> = ["a", "a.b", "a.b.c", "x", "x.y", "x.z"];
 * ```
 */
export type DotPath<T extends object | undefined> = DotPathImpl<
	Required<NonNullable<T>>,
	AllKeysOf<T>
>;
