import { isOrderValueAsc, isOrderValueDesc } from "./entity-order.functions";
import { OrderValueAsc, OrderValueDesc } from "./entity-order.types";

describe("EntityOrder", () => {
	describe("OrderValue", () => {
		it("should determine an `ASC` order", () => {
			for (const order of ["asc", "asc_nf", "asc_nl"] satisfies OrderValueAsc[]) {
				expect(isOrderValueAsc(order)).toBeTrue();
			}

			for (const order of ["desc", "desc_nf", "desc_nl"] satisfies OrderValueDesc[]) {
				expect(isOrderValueAsc(order)).toBeFalse();
			}
		});

		it("should determine an `DESC` order", () => {
			for (const order of ["asc", "asc_nf", "asc_nl"] satisfies OrderValueAsc[]) {
				expect(isOrderValueDesc(order)).toBeFalse();
			}

			for (const order of ["desc", "desc_nf", "desc_nl"] satisfies OrderValueDesc[]) {
				expect(isOrderValueDesc(order)).toBeTrue();
			}
		});
	});
});
