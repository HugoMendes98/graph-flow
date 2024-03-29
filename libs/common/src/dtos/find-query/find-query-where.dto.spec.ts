import { plainToInstance } from "class-transformer";
import { IS_NUMBER, IS_STRING, IS_DATE, validateSync } from "class-validator";

import { FindQueryWhereDtoOf } from "./find-query-where.dto";
import { transformOptions, validatorOptions } from "../../options";
import { omit } from "../../utils/object-fns";
import { DtoProperty } from "../dto";

describe("FindQueryWhereDto", () => {
	const validate = (object: object) => validateSync(object, validatorOptions);

	describe("Validation on a flat DTO", () => {
		class FlatDto {
			@DtoProperty()
			public a!: number;
			@DtoProperty()
			public b!: string;
			@DtoProperty({
				nullable: true,
				type: () => String
			})
			public c!: "literal" | null;
			@DtoProperty()
			public d!: Date;
			@DtoProperty()
			public e!: "a" | "b";
			@DtoProperty({
				nullable: true,
				type: () => String
			})
			public f!: string | null;
		}

		class FlatWhereDto extends FindQueryWhereDtoOf(FlatDto) {}
		const transform = (object: object) =>
			plainToInstance(
				FlatWhereDto,
				object,
				omit(transformOptions, ["strategy"])
			);

		it("should be valid (without logical)", () => {
			const wheres: FlatWhereDto[] = [
				{
					a: { $gt: 3, $lt: 9 },
					b: "ok",
					c: null,
					f: { $like: "abc" }
				},
				{ a: 0, b: { $gt: "abc" }, d: { $lt: new Date() }, f: null },
				{}
			];

			for (const where of wheres) {
				const errors = validate(transform(where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be valid (with logical)", () => {
			const wheres: Array<InstanceType<typeof FlatWhereDto>> = [
				{
					$and: [
						{
							a: { $gt: 3, $lt: 9 },
							b: "ok",
							c: null,
							f: { $like: "abc" }
						},
						{
							a: 0,
							b: { $gt: "abc" },
							d: { $lt: new Date() },
							f: null
						},
						{}
					]
				},
				{
					$not: { $and: [{ a: 1 }, { a: 2 }] },
					$or: [{ a: 1 }, { a: 5 }]
				}
			];

			for (const where of wheres) {
				const errors = validate(transform(where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const where: FlatWhereDto = {
				a: { $gt: "3" as unknown as number },
				d: 2 as unknown as Date,
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- for test
				e: { abc: "a" } as never,
				f: { $lte: new Date() as unknown as null }
			};

			const errors = validate(transform(where));
			expect(errors).toHaveLength(4);

			const errA = errors.find(
				({ property }) =>
					property === ("a" satisfies keyof FlatWhereDto)
			);
			const errD = errors.find(
				({ property }) =>
					property === ("d" satisfies keyof FlatWhereDto)
			);
			const errE = errors.find(
				({ property }) =>
					property === ("e" satisfies keyof FlatWhereDto)
			);
			const errF = errors.find(
				({ property }) =>
					property === ("f" satisfies keyof FlatWhereDto)
			);
			expect(errA).toBeDefined();
			expect(errD).toBeDefined();
			expect(errE).toBeDefined();
			expect(errF).toBeDefined();

			expect(errA?.children?.[0].constraints).toHaveProperty(IS_NUMBER);
			expect(errD?.children?.[0].constraints).toHaveProperty(IS_DATE);
			expect(errE?.children?.[0].constraints).toHaveProperty(
				"whitelistValidation"
			);
			expect(errF?.children?.[0].constraints).toHaveProperty(IS_STRING);
		});
	});

	describe("Validation on a nested DTO", () => {
		class NestedDDto {
			@DtoProperty()
			public e!: string;
		}
		class NestedBDto {
			@DtoProperty()
			public c!: number;
			@DtoProperty()
			public d!: NestedDDto;
			@DtoProperty()
			public f!: Date;
		}
		class NestedDto {
			@DtoProperty()
			public a!: number;
			@DtoProperty()
			public b!: NestedBDto;
		}

		const NestedWhereDto = FindQueryWhereDtoOf(NestedDto);
		const transform = (object: object) =>
			plainToInstance(NestedWhereDto, object, transformOptions);

		it("should be valid", () => {
			const wheres: Array<InstanceType<typeof NestedWhereDto>> = [
				{ a: 2, b: { d: { e: "s" }, f: { $lte: new Date() } } },
				{ b: { c: { $nin: [1, 2, 5] } } },
				{ $and: [{ b: { c: { $lt: 3 } } }, { a: { $ne: -10 } }], a: 4 }
			];

			for (const where of wheres) {
				const errors = validate(transform(where));
				expect(errors).toHaveLength(0);
			}
		});
	});

	describe("Validation with discriminated types", () => {
		abstract class NestedBase<T extends 1 | 2 | 3> {
			@DtoProperty()
			public type!: T;
		}
		class Nested1 extends NestedBase<1> {
			@DtoProperty() public a!: string;
			@DtoProperty() public bool!: boolean;
		}
		class Nested2 extends NestedBase<2> {
			@DtoProperty() public b!: string;
		}
		class Nested3 extends NestedBase<3> {
			@DtoProperty() public c!: string;
		}

		type Nested = Nested1 | Nested2 | Nested3;
		class Dto {
			@DtoProperty({
				discriminator: {
					property: "type",
					subTypes: [
						{ name: 1, value: Nested1 },
						{ name: 2, value: Nested2 },
						{ name: 3, value: Nested3 }
					]
				},
				type: () => NestedBase
			})
			public nested!: Nested;
		}

		class NestedWhereDto extends FindQueryWhereDtoOf(Dto) {}
		const transform = (object: object) =>
			plainToInstance(
				NestedWhereDto,
				object,
				omit(transformOptions, ["strategy"])
			);

		it("should be valid", () => {
			const wheres: NestedWhereDto[] = [
				{ nested: { type: 1 } },
				{ nested: { b: "a", type: 2 } },
				{ nested: { c: { $ne: "v" }, type: 3 } },
				{ nested: { type: { $ne: 2 } } }
			];
			for (const where of wheres) {
				const errors = validate(transform(where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const wheres: NestedWhereDto[] = [
				// Wrong type TODO: as discriminated property with possible values?
				{ nested: { type: 4 as never } },
				{ nested: { c: { $ne: 1 as unknown as string }, type: 3 } },
				// // Wrong discrimination
				{ nested: { a: "a", type: 2 } },
				{ nested: { c: "a", type: { $ne: 2 } } }
			];
			for (const where of wheres) {
				const errors = validate(transform(where));
				expect(errors).toHaveLength(1);
			}
		});
	});
});
