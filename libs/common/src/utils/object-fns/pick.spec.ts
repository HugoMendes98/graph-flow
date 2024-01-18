import { pick } from "./pick";

describe("object-fns `pick`", () => {
	interface Struct {
		p1: unknown;
		p2: unknown;
		p3: unknown;
		p4?: unknown;
		p5?: unknown;
	}
	type Key = keyof Struct;

	it("should keep some keys", () => {
		const ref: Struct = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };

		for (const toPick of [
			["p4"],
			["p3", "p5", "p2"],
			[],
			["p1", "p2", "p3", "p4", "p5"]
		] satisfies Key[][]) {
			const picked = Object.keys(pick(ref, toPick));

			// The number of keys should be different
			expect(picked).toHaveLength(toPick.length);
			expect(toPick.every(key => picked.includes(key))).toBe(true);
		}
	});

	it("should be ok with optional (and unknown) keys", () => {
		const ref: Struct = { p1: 0, p2: 0, p3: 0 };
		expect(pick(ref, ["p1", "p2", "p3"])).toStrictEqual({
			p1: 0,
			p2: 0,
			p3: 0
		});
		expect(pick(ref, ["p1", "p2", "p3", "p4", "p5"])).toStrictEqual({
			p1: 0,
			p2: 0,
			p3: 0
		});
		expect(pick(ref, ["p3", "p4", "p5"])).toStrictEqual({ p3: 0 });
		expect(pick(ref, ["p1", "p0" as Key])).toStrictEqual({ p1: 0 });
	});
});
