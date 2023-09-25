import {
	OrderValue,
	OrderValueAsc,
	OrderValueDesc,
	OrderValues,
	OrderValuesAsc,
	OrderValuesDesc
} from "./entity-order.types";

/**
 * Determines the direction of an order (mostly for type inference).
 *
 * @param order to determine
 * @returns if the value is "ASC"
 */
export function isOrderValueAsc(order: OrderValue): order is OrderValueAsc {
	return OrderValuesAsc.includes(order as OrderValueAsc);
}

/**
 * Determines the direction of an order (mostly for type inference).
 *
 * @param order to determine
 * @returns if the value is "DESC"
 */
export function isOrderValueDesc(order: OrderValue): order is OrderValueDesc {
	return OrderValuesDesc.includes(order as OrderValueDesc);
}

/**
 * Determines if the given value is an {@link OrderValue}.
 *
 * @param order to determine
 * @returns if the value is an {@link OrderValue}
 */
export function isOrderValue(order: unknown): order is OrderValue {
	return OrderValues.includes(order as OrderValue);
}
