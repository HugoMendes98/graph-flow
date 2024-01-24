import {
	castNodeIoValueTo,
	CastNodeIoValueToException
} from "./node-io.functions";
import { NODE_IO_VOID, NodeIoType, NodeIoValueFromType } from "./node-io.type";

describe("castNodeIoValueTo", () => {
	it("should cast to number", () => {
		for (const [value, expected] of [
			[123, 123],
			["104", 104],
			["1e3", 1000]
		] satisfies Array<[unknown, NodeIoValueFromType<NodeIoType.NUMBER>]>) {
			expect(castNodeIoValueTo(NodeIoType.NUMBER, value)).toBe(expected);
		}
	});

	it("should cast to string", () => {
		for (const [value, expected] of [
			["abc", "abc"],
			[104, "104"],
			[{ a: 1, b: 2 }, "[object Object]"]
		] satisfies Array<[unknown, NodeIoValueFromType<NodeIoType.STRING>]>) {
			expect(castNodeIoValueTo(NodeIoType.STRING, value)).toBe(expected);
		}
	});

	it("should cast to JSON", () => {
		for (const [value, expected] of [
			[104, 104],
			['[104,"abc"]', [104, "abc"]],
			['{"a":true,"b":[{"c":false}]}', { a: true, b: [{ c: false }] }],
			[
				{ a: {}, b: null },
				{ a: {}, b: null }
			]
		] satisfies Array<[unknown, NodeIoValueFromType<NodeIoType.JSON>]>) {
			expect(castNodeIoValueTo(NodeIoType.JSON, value)).toStrictEqual(
				expected
			);
		}
	});

	it("should cast to ANY", () => {
		for (const value of [
			"abc",
			123,
			[1, 2, 3, { a: 4 }],
			null,
			false,
			{ a: 1, b: true }
		] satisfies Array<NodeIoValueFromType<NodeIoType.ANY>>) {
			expect(castNodeIoValueTo(NodeIoType.ANY, value)).toStrictEqual(
				value
			);
		}
	});

	it("should cast to VOID", () => {
		for (const value of [
			"abc",
			123,
			[1, 2, 3, { a: 4 }],
			null,
			false,
			{ a: 1, b: true }
		] satisfies unknown[]) {
			expect(castNodeIoValueTo(NodeIoType.VOID, value)).toStrictEqual(
				NODE_IO_VOID
			);
		}
	});

	describe("Cast errors", () => {
		it('should throw error when the value is not "JSON-able"', () => {
			for (const value of ["not JSON-able"]) {
				expect(() => castNodeIoValueTo(NodeIoType.JSON, value)).toThrow(
					CastNodeIoValueToException
				);
			}
		});

		it('should throw error when the value is not "number-able"', () => {
			for (const value of ["abc", { a: 1, b: false }]) {
				let error: CastNodeIoValueToException | false = false;
				try {
					castNodeIoValueTo(NodeIoType.NUMBER, value);
				} catch (err: unknown) {
					error = err as never;
				}

				expect(error).toBeInstanceOf(CastNodeIoValueToException);
				expect(error).toStrictEqual(
					new CastNodeIoValueToException(NodeIoType.NUMBER, value)
				);
			}
		});
	});
});
