import { OrderValue, OrderValueAsc, OrderValueDesc, OrderValuesAsc } from "./entity-order.types";

/**
 * Determines the direction of an order (mostly for type inference).
 *
 * @param order to determine
 * @returns of the value is "ASC"
 */
export function isOrderValueAsc(order: OrderValue): order is OrderValueAsc {
	return OrderValuesAsc.includes(order as OrderValueAsc);
}

/**
 * Determines the direction of an order (mostly for type inference).
 *
 * @param order to determine
 * @returns of the value is "DESC"
 */
export function isOrderValueDesc(order: OrderValue): order is OrderValueDesc {
	return !isOrderValueAsc(order);
}
