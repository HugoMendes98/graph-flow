import { QueryOrder } from "@mikro-orm/core";
import { ExcludeFunctions } from "@mikro-orm/core/typings";
import { BadRequestException } from "@nestjs/common";
import { ReadonlyDeep } from "type-fest";
import { EntityOrder, OrderValue } from "~/lib/common/endpoints";
import { Primitive } from "~/lib/common/types";

/**
 * The Order values converted
 */
export type EntityQueryOrder =
	| QueryOrder.ASC
	| QueryOrder.ASC_NULLS_FIRST
	| QueryOrder.ASC_NULLS_LAST
	| QueryOrder.DESC
	| QueryOrder.DESC_NULLS_FIRST
	| QueryOrder.DESC_NULLS_LAST;

export type EntityQueryOrderMap<T> = {
	[K in keyof T as ExcludeFunctions<T, K>]?: T[K] extends Date | Primitive
		? EntityQueryOrder
		: EntityQueryOrderMap<
				NonNullable<T[K] extends Array<infer U> ? U : T[K]>
			>;
};

function entityOrder2QueryOrder(value: string): EntityQueryOrder;
function entityOrder2QueryOrder<T>(
	order: Readonly<EntityOrder<T>>
): EntityQueryOrderMap<T>;
/**
 * Convert an entity order to a Mikro-orm query object compatible entity
 *
 * @param order The entity order to convert
 * @throws BadRequestException
 * @returns The Mikro-orm query object
 */
function entityOrder2QueryOrder<T>(
	order: ReadonlyDeep<EntityOrder<T>> | string
): EntityQueryOrder | EntityQueryOrderMap<T> {
	if (
		typeof order === "number" ||
		[true, false, null, undefined].includes(order as never)
	) {
		throw new BadRequestException(`Unknown order value: ${String(order)}`);
	}

	if (typeof order === "string") {
		switch (order as OrderValue) {
			case "asc":
				return QueryOrder.ASC;
			case "asc_nf":
				return QueryOrder.ASC_NULLS_FIRST;
			case "asc_nl":
				return QueryOrder.ASC_NULLS_LAST;

			case "desc":
				return QueryOrder.DESC;
			case "desc_nf":
				return QueryOrder.DESC_NULLS_FIRST;
			case "desc_nl":
				return QueryOrder.DESC_NULLS_LAST;
			default:
				throw new BadRequestException(`Unknown order value: ${order}`);
		}
	}

	return Object.fromEntries(
		Object.entries(order as object).map(([key, value]) => [
			key,
			entityOrder2QueryOrder(value as never)
		])
	) as never;
}

/**
 * Converts an `EntityOrder` to a `QueryOrder` that can be used with Mikro-orm
 *
 * @param order The entity order to convert
 * @returns The Mikro-orm query object
 */
export function entityOrderToQueryOrder<T extends object>(
	order: Readonly<EntityOrder<T>>
): EntityQueryOrderMap<T> {
	return entityOrder2QueryOrder<T>(order);
}
