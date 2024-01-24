import { omit } from "./omit";

describe("object-fns `omit`", () => {
	interface Struct {
		p1: unknown;
		p2: unknown;
		p3: unknown;
		p4?: unknown;
		p5?: unknown;
	}
	type Key = keyof Struct;

	it("should remove some keys", () => {
		const ref: Struct = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
		const all = Object.keys(ref) as Key[];

		for (const toRemove of [
			["p4"],
			["p3", "p5", "p2"],
			[],
			["p1", "p2", "p3", "p4", "p5"]
		] satisfies Key[][]) {
			const kept = Object.keys(omit(ref, toRemove));
			const mustBeKept = all.filter(key => !toRemove.includes(key));

			// The number of keys should be different
			expect(kept).toHaveLength(all.length - toRemove.length);
			expect(kept).toHaveLength(mustBeKept.length);

			expect(mustBeKept.every(key => kept.includes(key))).toBe(true);
		}
	});

	it("should be ok with optional (and unknown keys) keys", () => {
		const ref: Struct = { p1: 0, p2: 0, p3: 0 };
		expect(omit(ref, ["p1", "p2", "p3"])).toStrictEqual({});
		expect(omit(ref, ["p1", "p2", "p3", "p4", "p5"])).toStrictEqual({});
		expect(omit(ref, ["p3", "p4", "p5"])).toStrictEqual({ p1: 0, p2: 0 });
		expect(omit(ref, ["p1", "p2", "p3", "p4", "p0" as Key])).toStrictEqual(
			{}
		);
	});
});
