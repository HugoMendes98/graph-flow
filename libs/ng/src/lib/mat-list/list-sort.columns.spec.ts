import { OrderValue } from "~/lib/common/endpoints";

import { ListSortColumns } from "./list-sort.columns";

describe("ListSortColumns", () => {
	it("should find the correct column", () => {
		const lsc = new ListSortColumns([
			{ column: 1, direction: "asc" },
			{ column: 2, direction: "desc" },
			{ column: 3, direction: "desc" }
		]);

		const col1 = lsc.findIndexByColumn(1);
		const col3 = lsc.findIndexByColumn(3);
		expect(col1).toBeDefined();
		expect(col1?.position).toBe(0);
		expect(col3).toBeDefined();
		expect(col3?.position).toBe(2);
	});

	it("should not find the correct column", () => {
		const lsc = new ListSortColumns<1 | 2 | 3>([
			{ column: 1, direction: "asc" },
			// { column: 2, direction: "desc" },
			{ column: 3, direction: "desc" }
		]);

		const col2 = lsc.findIndexByColumn(2);
		expect(col2).toBeUndefined();
	});

	describe("Update", () => {
		let lsc: ListSortColumns<1 | 2 | 3 | 4, OrderValue>;

		beforeEach(() => {
			lsc = new ListSortColumns([
				{ column: 2, direction: "desc" },
				{ column: 1, direction: "asc" },
				{ column: 3, direction: "desc" }
			]);
		});

		it("should remove from columns", () => {
			const updated = lsc.updateColumn(2, () => false);

			expect(lsc.columns).toHaveLength(3);
			expect(updated.columns).toHaveLength(2);
			expect(updated.findIndexByColumn(2)).toBeUndefined();
		});

		it("should update a column", () => {
			const updated = lsc.updateColumn(2, () => "asc_nf");

			expect(lsc.columns).toHaveLength(3);
			expect(updated.columns).toHaveLength(3);

			const colB2 = lsc.findIndexByColumn(2);
			const colA2 = updated.findIndexByColumn(2);

			expect(colB2?.item.direction).toBe("desc");
			expect(colA2?.item.direction).toBe("asc_nf");
		});

		it("should add a column", () => {
			const updated = lsc.updateColumn(4, () => "asc_nf");

			expect(lsc.columns).toHaveLength(3);
			expect(updated.columns).toHaveLength(4);

			const col4 = updated.findIndexByColumn(4);

			expect(col4?.position).toBe(3);
			expect(col4?.item.direction).toBe("asc_nf");
		});

		it("should do nothing when removing an non-existing column", () => {
			const updated = lsc.updateColumn(4, () => false);
			expect(updated).toBe(lsc);
		});
	});
});
