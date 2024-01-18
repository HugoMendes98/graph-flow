import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { WhereNumberDto, WhereNumberNullableDto } from "./where-number.dto";

describe("WhereNumberDto", () => {
	describe("Validation", () => {
		const validate = (value: object) =>
			validateSync(value, {
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
				whitelist: true
			});

		it("should be valid", () => {
			const wheres: WhereNumberDto[] = [
				{ $eq: 1, $gt: 2, $gte: 3, $lt: 4, $lte: 5, $ne: 6 },
				{ $in: [7, 8], $nin: [9, 0] },
				{ $exists: true, $nin: [] },
				{ $exists: false }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereNumberDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be valid (with nullable)", () => {
			const wheres: WhereNumberNullableDto[] = [
				{ $eq: null, $gt: 2, $gte: 3, $lt: 4, $lte: 5, $ne: 6 },
				{ $in: [7, 8], $ne: null },
				{ $exists: false }
			];

			for (const where of wheres) {
				const errors = validate(
					plainToInstance(WhereNumberNullableDto, where)
				);
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const toFails: Array<[WhereNumberDto, number]> = [
				[{ $eq: "a" as unknown as number }, 1],
				[{ $eq: null as unknown as number }, 1],
				// In an array the string will be cast to number
				[
					{
						$exists: 2 as unknown as boolean,
						$in: [4, "3" as unknown as number]
					},
					1
				],

				[
					{
						$ne: new Date().toISOString() as unknown as number,
						// @ts-expect-error -- Want an additional property for testing
						a: 2
					},
					2
				]
			];

			for (const [where, expectedNError] of toFails) {
				const errors = validate(plainToInstance(WhereNumberDto, where));
				expect(errors).toHaveLength(expectedNError);
			}
		});
	});
});
