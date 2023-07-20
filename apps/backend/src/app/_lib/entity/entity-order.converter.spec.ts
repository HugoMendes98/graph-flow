import { QueryOrder } from "@mikro-orm/core";
import { BadRequestException } from "@nestjs/common";
import { EntityOrder } from "~/lib/common/endpoints/_lib";

import { entityOrderToQueryOrder } from "./entity-order.converter";

interface ITest {
	a: number;
	b: string;
	nested: {
		c: Date | null;
		d: number;
	};
}

describe("entityOrderToQueryOrder", () => {
	it("should decode correctly", () => {
		const decoded1 = entityOrderToQueryOrder<ITest>({
			a: "asc",
			nested: {
				c: "desc"
			}
		});

		expect(decoded1.a).toBe(QueryOrder.ASC);
		expect(decoded1.b).toBeUndefined();
		expect(decoded1.nested?.c).toBe(QueryOrder.DESC);
		expect(decoded1.nested?.d).toBeUndefined();

		const decoded2 = entityOrderToQueryOrder<ITest>({
			a: "asc_nf",
			b: "asc_nl",
			nested: {
				c: "desc_nf",
				d: "desc_nl"
			}
		});

		expect(decoded2.a).toBe(QueryOrder.ASC_NULLS_FIRST);
		expect(decoded2.b).toBe(QueryOrder.ASC_NULLS_LAST);
		expect(decoded2.nested?.c).toBe(QueryOrder.DESC_NULLS_FIRST);
		expect(decoded2.nested?.d).toBe(QueryOrder.DESC_NULLS_LAST);
	});

	it("should thrown and error", () => {
		const tests: Array<EntityOrder<ITest>> = [
			{ a: "asc", nested: { c: "desce" as never } },
			{ b: 2 as never },
			{ a: false as never },
			{ nested: { d: null as never } }
		];

		for (const encoded of tests) {
			expect(() => entityOrderToQueryOrder(encoded)).toThrow(BadRequestException);
		}
	});
});
