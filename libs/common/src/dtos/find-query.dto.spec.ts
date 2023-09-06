import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { DtoProperty } from "./dto";
import { FindQueryDtoOf } from "./find-query.dto";
import { OrderValue } from "../endpoints";
import { transformOptions, validatorOptions } from "../options";

describe("FindQueryDto", () => {
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

	class FindQueryDto extends FindQueryDtoOf(NestedDto) {}

	const transform = (object: object) => plainToInstance(FindQueryDto, object, transformOptions);
	const validate = (object: object) => validateSync(object, validatorOptions);

	for (const key of ["limit", "skip"] satisfies Array<keyof FindQueryDto>) {
		describe(`Property \`${key}\``, () => {
			it("should be valid", () => {
				const queries: FindQueryDto[] = [{ [key]: 0 }, { [key]: 10 }];

				for (const query of queries) {
					const errors = validate(transform(query));
					expect(errors).toHaveLength(0);
				}
			});

			it("should be invalid (with correct types)", () => {
				const query: FindQueryDto = { [key]: -1 };

				const errors = validate(transform(query));
				expect(errors).not.toHaveLength(10);
			});
		});
	}

	describe("Property `order`", () => {
		it("should be valid", () => {
			const orders: Array<NonNullable<FindQueryDto["order"]>> = [
				[{ a: "asc" }],
				[{ b: { d: { e: "desc" } } }],
				[{ a: "asc" }, { b: { f: "desc" } }]
			];

			for (const order of orders) {
				const errors = validate(transform({ order } satisfies FindQueryDto));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be invalid", () => {
			const orders: Array<NonNullable<FindQueryDto["order"]>> = [
				[{ a: "asc-desc" as OrderValue }],
				{ a: "asc" } as unknown as NonNullable<FindQueryDto["order"]>
			];

			for (const order of orders) {
				const errors = validate(transform({ order } satisfies FindQueryDto));
				expect(errors).not.toHaveLength(0);
			}
		});
	});

	describe("Property `where`", () => {
		it("should be valid", () => {
			const wheres: Array<NonNullable<FindQueryDto["where"]>> = [
				{ a: 1 },
				{ $or: [{ a: 1 }, { b: { c: 3 } }] }
			];

			for (const where of wheres) {
				const errors = validate(transform({ where } satisfies FindQueryDto));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be invalid (incorrect type)", () => {
			const wheres: Array<NonNullable<FindQueryDto["where"]>> = [
				{ a: "abc" as unknown as number },
				{ $and: [{ a: "abc" as unknown as number }] }
			];

			for (const where of wheres) {
				const errors = validate(transform({ where } satisfies FindQueryDto));
				expect(errors).not.toHaveLength(0);
			}
		});
	});
});
