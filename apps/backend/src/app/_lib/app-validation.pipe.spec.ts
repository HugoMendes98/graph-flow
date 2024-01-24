import { BadRequestException } from "@nestjs/common";
import { DtoProperty } from "~/lib/common/dtos/dto";
import { FindQueryDtoOf } from "~/lib/common/dtos/find-query.dto";

import { AppValidationPipe } from "./app-validation.pipe";

describe("AppValidationPipe", () => {
	class Dto {
		@DtoProperty()
		public prop!: number;
	}

	class FindQueryDto extends FindQueryDtoOf(Dto) {}

	const pipe = new AppValidationPipe();

	it("should be defined", () => {
		expect(pipe).toBeDefined();
	});

	describe("Implicit conversion", () => {
		it("should not convert when the value is a body", async () => {
			await expect(
				pipe.transform(
					{ limit: "5" as unknown as number } satisfies FindQueryDto,
					{
						metatype: FindQueryDto,
						type: "body"
					}
				)
			).rejects.toThrow(BadRequestException);
		});

		it("should convert when the value is a query", async () => {
			const transformed = (await pipe.transform(
				{ limit: "5" as unknown as number } satisfies FindQueryDto,
				{ metatype: FindQueryDto, type: "query" }
			)) as FindQueryDto;

			expect(transformed.limit).toBe(5);
		});
	});
});
