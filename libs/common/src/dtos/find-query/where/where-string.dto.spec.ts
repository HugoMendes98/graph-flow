import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { WhereStringDto, WhereStringNullableDto } from "./where-string.dto";

describe("WhereStringDto", () => {
	describe("Validation", () => {
		const validate = (value: object) =>
			validateSync(value, {
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
				whitelist: true
			});

		it("should be valid", () => {
			const wheres: WhereStringDto[] = [
				{ $eq: "1", $gt: "2", $gte: "3", $lt: "4", $lte: "5", $ne: "6" },
				{ $in: ["7", "8"], $nin: ["9", "0"] },
				{ $exists: true, $nin: [] },
				{ $exists: false },
				{ $like: "abc", $re: "def" }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereStringDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be valid (with nullable)", () => {
			const wheres: WhereStringNullableDto[] = [
				{ $eq: null, $gt: "2", $gte: "3", $lt: "4", $lte: "5", $ne: "6" },
				{ $in: ["7", "8"], $ne: null },
				{ $like: "abc", $re: "def" }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereStringNullableDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const toFails: Array<[WhereStringDto, number]> = [
				[{ $eq: 1 as unknown as string }, 1],
				[{ $eq: null as unknown as string }, 1],
				// Values are cast in array (when possible)
				[{ $exists: 2 as unknown as boolean, $in: ["3", 4 as unknown as string] }, 1],
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- For test
				[{ $ne: new Date() as unknown as string, a: 2 } as WhereStringDto, 2],
				[{ $like: new Date() as unknown as string, $re: 3 as unknown as string }, 2]
			];

			for (const [where, expectedNError] of toFails) {
				const errors = validate(plainToInstance(WhereStringDto, where));
				expect(errors).toHaveLength(expectedNError);
			}
		});
	});
});
