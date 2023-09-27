import { type Collection } from "@mikro-orm/core";
import { type ExcludeFunctions } from "@mikro-orm/core/typings";

import { Primitive } from "../types";

/** All the possible values for `OrderValues` "ASC" */
export const OrderValuesAsc = ["asc_nf", "asc_nl", "asc"] as const;
/** All the possible values for `OrderValues` "DESC" */
export const OrderValuesDesc = ["desc_nf", "desc_nl", "desc"] as const;
/** All the possible values for `OrderValues` */
export const OrderValues = [...OrderValuesAsc, ...OrderValuesDesc] as const;

/** Order values "ASC" */
export type OrderValueAsc = (typeof OrderValuesAsc)[number];
/** Order values "DESC" */
export type OrderValueDesc = (typeof OrderValuesDesc)[number];

/** Possible value for ordering */
export type OrderValue = (typeof OrderValues)[number];

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
