import { httpQueryDecode } from "./http-query.decode";
import { httpQueryEncode } from "./http-query.encode";
import { QueryPrefixIdentifier, QueryValue } from "./http-query.types";

describe("HTTP Query transformer", () => {
	describe("Encode/decode query strings", () => {
		const queryPrefixes = Object.values(QueryPrefixIdentifier);

		// The important test
		it("should encode and decode to the same value", () => {
			const values: QueryValue[] = [
				"just a string",
				123,
				null,
				34.4,
				false,
				new Date(),
				undefined,
				true,
				/^reg(ex)?/
			];

			for (const value of values) {
				const encoded = httpQueryEncode(value);
				const decoded = httpQueryDecode(encoded);

				expect(decoded).toStrictEqual(value);
			}
		});

		it("should be a prefix at the beginning of the encoded string", () => {
			const values: QueryValue[] = [
				1,
				null,
				new Date(),
				false,
				true,
				-4.2,
				undefined,
				/reg(ex)?/
			];

			for (const value of values) {
				const encoded = httpQueryEncode(value);
				const prefix = encoded.charAt(0) as QueryPrefixIdentifier;

				expect(queryPrefixes.includes(prefix)).toBeTruthy();

				// Ok, but ant i-pattern
				// expect(queryPrefixes).toContain(prefix)
			}
		});

		it("should not be a prefix at the beginning of the encoded string", () => {
			const values: QueryValue[] = ["a string", "and", "another", "! :)"];
			for (const value of values) {
				const encoded = httpQueryEncode(value);
				const prefix = encoded.charAt(0) as QueryPrefixIdentifier;

				expect(queryPrefixes.includes(prefix)).toBeFalsy();
				expect(encoded.charAt(0)).toBe((value as string).charAt(0));
			}
		});

		// The format is not tested as it is abstracted in the 2 functions
	});

	describe("Encode/decode query objects", () => {
		const objects = [
			{
				date: new Date(),
				false: false,
				null: null,
				number: 2,
				regex: /reg(ex)?/,
				string: "string",
				true: true,
				undefined: undefined
			},
			{
				flatArray: [1, "2", false, new Date()],
				nested: { nestedA: { a: true }, nestedB: { b: undefined } },
				nestedArray: {
					nestedA: ["1", { b: /reg(ex)?/ }],
					nestedB: { a: [1, 2, 3], b: [/reg(ex)?/, new Date()] }
				},
				value: 2
			}
		] as const;

		// The important test
		it("should encode and decode to the same object", () => {
			for (const object of objects) {
				const encoded = httpQueryEncode(object);
				const decoded = httpQueryDecode(encoded);

				expect(decoded).toStrictEqual(object);
			}
		});

		it("should not be the same value when encoded", () => {
			const [flat, complex] = objects;

			const encodedFlat = httpQueryEncode(flat);
			expect(encodedFlat.date).not.toBe(flat.date);
			expect(encodedFlat.false).not.toBe(flat.false);
			expect(encodedFlat.null).not.toBe(flat.null);
			expect(encodedFlat.number).not.toBe(flat.number);
			expect(encodedFlat.regex).not.toBe(flat.regex);
			expect(encodedFlat.true).not.toBe(flat.true);
			expect(encodedFlat.string).toBe(flat.string);

			const encodedComplex = httpQueryEncode(complex);
			expect(encodedComplex.flatArray[0]).not.toBe(complex.flatArray[0]);
			expect(encodedComplex.nested.nestedA.a).not.toBe(complex.nested.nestedA.a);
			expect(encodedComplex.nested.nestedB.b).not.toBe(complex.nested.nestedB.b);
			expect(encodedComplex.nestedArray.nestedA[1].b).not.toBe(
				complex.nestedArray.nestedA[1].b
			);
			expect(encodedComplex.nestedArray.nestedB.b[0]).not.toBe(
				complex.nestedArray.nestedB.b[0]
			);
			expect(encodedComplex.value).not.toBe(complex.value);

			expect(encodedComplex.nestedArray.nestedA[0]).toBe(complex.nestedArray.nestedA[0]);
		});
	});
});
