import { isObject } from "class-validator";
import { ReadonlyDeep } from "type-fest";

import {
	QueryValue,
	QueryEncoded,
	QueryPrefixIdentifier,
	QueryPrimitiveValue
} from "./http-query.types";

/**
 * Possible options when encoding HTTP Queries
 */
export interface HttpQueryEncodeOptions {
	/**
	 * Do no keep `undefined` values on objects.
	 *
	 * @example ```
	 * { a: "2", b: undefined } -> { a: "" }
	 * ```
	 */
	ignoreUndefined?: boolean;
}

/**
 * Encode a query value to its query "form".
 *
 * @param query The query value to encode
 * @returns The encoded query
 */
export function httpQueryEncode(query: QueryValue): string;
/**
 * Encode a query array to its query "form" with all its values encoded.
 *
 * @param query The query to encode
 * @param options Options for encoding
 * @returns The encoded query
 */
export function httpQueryEncode<T>(
	query: readonly T[],
	options?: ReadonlyDeep<HttpQueryEncodeOptions>
): Array<QueryEncoded<T>>;
/**
 * Encode a query object to its query "form" with all its values encoded.
 *
 * @param query The query to encode
 * @param options Options for encoding
 * @returns The encoded query
 */
export function httpQueryEncode<T extends Record<string, unknown>>(
	query: ReadonlyDeep<T>,
	options?: ReadonlyDeep<HttpQueryEncodeOptions>
): QueryEncoded<T>;

/**
 * Encode a query to its query "form".
 *
 * @param query The query to encode
 * @param options Options for encoding
 * @throws Error
 * @returns The encoded query
 */
export function httpQueryEncode<T>(
	query: ReadonlyDeep<T>,
	options?: ReadonlyDeep<HttpQueryEncodeOptions>
): QueryEncoded<QueryValue | object | []> {
	if (
		(
			[true, false, null, undefined] satisfies QueryPrimitiveValue[]
		).includes(query as never)
	) {
		return `${QueryPrefixIdentifier.PRIMITIVE}${query as string}`;
	}
	if (typeof query === "number") {
		return `${QueryPrefixIdentifier.NUMBER}${query}`;
	}
	if (query instanceof Date) {
		return `${QueryPrefixIdentifier.DATE}${query.toISOString()}`;
	}
	if (query instanceof RegExp) {
		return `${QueryPrefixIdentifier.REG_EXP}${query
			.toString()
			.slice(1, -1)}`;
	}

	if (typeof query === "string") {
		return query;
	}

	if (Array.isArray(query)) {
		return query.map(item => httpQueryEncode(item, options));
	}

	if (isObject(query)) {
		return Object.entries(query).reduce((encodedObject, [key, value]) => {
			if (options?.ignoreUndefined && value === undefined) {
				return encodedObject;
			}

			return {
				...encodedObject,
				[key]: httpQueryEncode(value)
			};
		}, {});
	}

	throw new Error(`Can not encode a query object: ${JSON.stringify(query)}`);
}
