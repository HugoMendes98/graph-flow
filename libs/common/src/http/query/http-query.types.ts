import { Primitive } from "../../types";

/**
 * Prefix identifier to encoded values.
 */
export enum QueryPrefixIdentifier {
	DATE = "\x02",
	NUMBER = "\x01",
	PRIMITIVE = "\x00",
	REG_EXP = "\x03"
}

type QueryEncodedDate = `${QueryPrefixIdentifier.DATE}${string}`;
type QueryEncodedNumber = `${QueryPrefixIdentifier.NUMBER}${string}`;
type QueryEncodedPrimitive = `${QueryPrefixIdentifier.PRIMITIVE}${string}`;
type QueryEncodedRegExp = `${QueryPrefixIdentifier.REG_EXP}${string}`;

/**
 * The possible types for a "query primitive" value.
 */
export type QueryPrimitiveValue = boolean | null | undefined;

/**
 * The possible types for a decoded query value.
 */
export type QueryValue = Date | Primitive | RegExp;

/**
 * Decoded query string to its value.
 */
export type QueryDecodedString<T extends string> = T extends QueryEncodedDate
	? Date
	: T extends QueryEncodedNumber
	? number
	: T extends QueryEncodedPrimitive
	? QueryPrimitiveValue
	: T extends QueryEncodedRegExp
	? RegExp
	: string;
/**
 * Decoded query to its value.
 */
export type QueryDecoded<T> = T extends string
	? QueryDecodedString<T>
	: T extends Array<infer U>
	? Array<QueryDecoded<U>>
	: { [P in keyof T]: QueryDecoded<T[P]> };

/**
 * Encoded query string from a query value.
 */
export type QueryEncodedValue<T extends QueryValue> = T extends Date
	? QueryEncodedDate
	: T extends number
	? QueryEncodedNumber
	: T extends QueryPrimitiveValue
	? QueryEncodedPrimitive
	: T extends RegExp
	? QueryEncodedRegExp
	: string;
/**
 * Encoded query object from an object.
 */
export type QueryEncoded<T> = T extends QueryValue
	? QueryEncodedValue<T>
	: T extends Array<infer U>
	? Array<QueryEncoded<U>>
	: { [P in keyof T]: QueryEncoded<T[P]> };

/**
 * An object that is encoded.
 */
export interface QueryEncodedObject {
	[key: string]: Array<QueryEncodedObject | string> | QueryEncodedObject | string;
}
