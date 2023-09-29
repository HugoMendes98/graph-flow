import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { FindQueryOrderDtoOf } from "./find-query-order.dto";
import { transformOptions, validatorOptions } from "../../options";
import { DtoProperty } from "../dto";

describe("FindQueryOrderDto", () => {
	const validate = (value: object) =>
		validateSync(value, { ...validatorOptions, forbidNonWhitelisted: true, whitelist: true });

	describe("Validation on a flat DTO", () => {
		class FlatDto {
			@DtoProperty()
			public a!: number;
			@DtoProperty()
			public b!: string;
			@DtoProperty()
			public c!: "literal";
			@DtoProperty()
			public d!: Date;
			@DtoProperty()
			public e!: "a" | "b";
			@DtoProperty({
				nullable: true,
				type: () => String
			})
			public f!: string | null;
			@DtoProperty()
			public g!: boolean;
		}

		const FlatOrderDto = FindQueryOrderDtoOf(FlatDto);
		const transform = (object: object) =>
			plainToInstance(FlatOrderDto, object, transformOptions);

		it("should be valid", () => {
			const orders: Array<InstanceType<typeof FlatOrderDto>> = [
				{ a: "asc", b: "desc", c: "asc_nf", d: "desc_nf" },
				{ e: "asc_nl", f: "desc_nl", g: "asc" },
				{}
			];

			for (const order of orders) {
				const errors = validate(transform(order));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const order: Partial<Record<keyof FlatDto, string>> = {
				a: "asc",
				b: "invalid",
				c: ""
			};

			const errors = validate(transform(order));
			expect(errors).toHaveLength(2);
			for (const error of errors) {
				expect(error.constraints).toHaveProperty("isIn");
			}
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

		const NestedOrderDto = FindQueryOrderDtoOf(NestedDto);
		const transform = (object: object) =>
			plainToInstance(NestedOrderDto, object, transformOptions);

		it("should be valid", () => {
			const orders: Array<InstanceType<typeof NestedOrderDto>> = [
				{ a: "asc", b: { c: "asc", d: { e: "desc" }, f: "asc" } },
				{ b: { c: "asc", d: {} } },
				{}
			];

			for (const order of orders) {
				const errors = validateSync(transform(order));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const order = { a: "asc", b: { c: "", d: { e: "qq" } } };

			const errors = validate(transform(order));
			expect(errors).toHaveLength(1);

			const [error] = errors;
			expect(error.children).toHaveLength(2);
			expect(error.constraints).toBeUndefined();

			const [childC, childD] = error.children ?? [];
			expect(childC.children).toHaveLength(0);
			expect(childC.constraints).toHaveProperty("isIn");

			expect(childD.children).toHaveLength(1);
			expect(childD.constraints).toBeUndefined();

			const [childE] = childD.children ?? [];
			expect(childE.children).toHaveLength(0);
			expect(childE.constraints).toHaveProperty("isIn");
		});
	});

	describe("Validation with discriminated types", () => {
		abstract class NestedBase<T extends 1 | 2 | 3> {
			@DtoProperty()
			public type!: T;
		}

		class Nested1 extends NestedBase<1> {
			@DtoProperty() public a!: string;
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

		class NestedOrderDto extends FindQueryOrderDtoOf(Dto) {}

		const transform = (object: object) =>
			plainToInstance(NestedOrderDto, object, {
				...transformOptions,
				excludeExtraneousValues: false
			});

		it("should be valid", () => {
			const orders: Array<InstanceType<typeof NestedOrderDto>> = [
				{ nested: { type: "asc" } },
				{ nested: { a: "asc" } },
				{}
			];

			for (const order of orders) {
				const errors = validate(transform(order));
				expect(errors).toHaveLength(0);
			}

			const toTransform = { nested: { a: "asc" } } as const satisfies InstanceType<
				typeof NestedOrderDto
			>;
			const transformed = transform(toTransform) as typeof toTransform;
			expect(transformed.nested.a).toBe(toTransform.nested.a);
		});

		it("should not be valid", () => {
			const orders: Array<InstanceType<typeof NestedOrderDto>> = [
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- for test
				{ nested: { d: "asc" } as never },
				{ nested: { a: "asc-desc" as never } }
			];

			for (const order of orders) {
				const errors = validate(transform(order));
				expect(errors).toHaveLength(1);
			}
		});
	});
});
