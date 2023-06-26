import { isObject } from "class-validator";
import { ReadonlyDeep } from "type-fest";

import {
	QUERY_PREFIX_IDENTIFIER,
	QueryDecoded,
	QueryDecodedString,
	QueryEncodedObject
} from "./http-query.types";

/**
 * Options when decoding HTTP query
 */
export interface HttpQueryDecodeOptions {
	/**
	 * Do no keep `undefined` values on objects.
	 *
	 * @example ```
	 * { a: "2", b: "<prefix>undefined" } -> { a: "2" }
	 * ```
	 */
	ignoreUndefined?: boolean;
}

/**
 * Decode a query string to its query value.
 *
 * @param query The query to decode
 * @returns The decoded query
 */
export function httpQueryDecode(query: string): QueryDecodedString<string>;
/**
 * Decode a query array to its query value with all its values decoded.
 *
 * @param query The query to decode
 * @param options Options for decoding
 * @returns The decoded query
 */
export function httpQueryDecode<T>(
	query: readonly T[],
	options?: ReadonlyDeep<HttpQueryDecodeOptions>
): Array<QueryDecoded<T>>;
/**
 * Decode a query object to its query value with all its values decoded.
 *
 * @param query The query to decode
 * @param options Options for decoding
 * @returns The decoded query
 */
export function httpQueryDecode<T extends QueryEncodedObject>(
	query: ReadonlyDeep<T>,
	options?: ReadonlyDeep<HttpQueryDecodeOptions>
): QueryDecoded<T>;

/**
 * Decode a query object to its query value with all its values decoded.
 *
 * @param query The query to decode
 * @param options Options for decoding
 * @throws Error
 * @returns The decoded query
 */
export function httpQueryDecode<T>(
	query: ReadonlyDeep<T>,
	options?: Readonly<HttpQueryDecodeOptions>
) {
	if (typeof query === "string") {
		// The real value if it has a prefix
		const value = query.substring(1);

		switch (query.charAt(0) as QUERY_PREFIX_IDENTIFIER) {
			case QUERY_PREFIX_IDENTIFIER.DATE:
				return new Date(value);
			case QUERY_PREFIX_IDENTIFIER.NUMBER:
				return +value;
			case QUERY_PREFIX_IDENTIFIER.PRIMITIVE:
				switch (value) {
					case "true":
						return true;
					case "false":
						return false;
					case "undefined":
						return undefined;
					case "null":
						return null;
					default:
						throw new Error(`Not a query primitive: ${query}`);
				}
			case QUERY_PREFIX_IDENTIFIER.REG_EXP:
				return new RegExp(value);
		}

		return query;
	}

	if (Array.isArray(query)) {
		return query.map(item => httpQueryDecode(item, options));
	}

	if (isObject(query)) {
		return Object.entries(query).reduce((decodedObject, [key, encoded]) => {
			const decoded = httpQueryDecode(encoded, options);

			if (options?.ignoreUndefined && decoded === undefined) {
				return decodedObject;
			}

			return {
				...decodedObject,
				[key]: decoded
			};
		}, {});
	}

	throw new Error(`Can not decode a query object: ${JSON.stringify(query)}`);
}
