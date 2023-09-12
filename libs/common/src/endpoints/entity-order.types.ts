import { type Collection } from "@mikro-orm/core";
import { type ExcludeFunctions } from "@mikro-orm/core/typings";

import { Primitive } from "../types";

/**
 * Possible value for ordering
 */
export type OrderValue = "asc_nf" | "asc_nl" | "asc" | "desc_nf" | "desc_nl" | "desc";

/**
 * All the possible values for `OrderValue`
 */
export const OrderValues: readonly OrderValue[] = [
	"asc_nf",
	"asc_nl",
	"asc",
	"desc_nf",
	"desc_nl",
	"desc"
];

// For array and Mikro-orm compatible
export type EntityFlat<T> = T extends ReadonlyArray<infer U>
	? U
	: T extends Collection<infer U>
	? U
	: T;

export type EntityOrder<T> = {
	[K in keyof T as ExcludeFunctions<T, K>]?: T[K] extends Date | Primitive
		? OrderValue
		: EntityOrder<NonNullable<EntityFlat<T[K]>>>;
};
