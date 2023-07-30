import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { WhereDateDto, WhereDateNullableDto } from "./where-date.dto";

describe("WhereDateDto", () => {
	describe("Validation", () => {
		const date = new Date();
		const validate = (value: object) =>
			validateSync(value, {
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
				whitelist: true
			});

		it("should be valid", () => {
			const wheres: WhereDateDto[] = [
				{ $eq: date, $gt: date, $gte: date, $lt: date, $lte: date, $ne: date },
				{ $in: [date, date], $nin: [date, date] },
				{ $exists: true, $nin: [] },
				{ $exists: false }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereDateDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be valid (with nullable)", () => {
			const wheres: WhereDateNullableDto[] = [
				{ $eq: null, $gt: date, $gte: date, $lt: date, $lte: date, $ne: date },
				{ $in: [date, date], $ne: null },
				{ $exists: false }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereDateNullableDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const toFails: Array<[WhereDateDto, number]> = [
				[{ $eq: "a" as unknown as Date }, 1],
				[{ $exists: 2 as unknown as boolean, $in: [date, "qff" as unknown as Date] }, 2],
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- For test
				[{ $ne: 2 as unknown as Date, a: 2 } as WhereDateDto, 2]
			];

			for (const [where, expectedNError] of toFails) {
				const errors = validate(plainToInstance(WhereDateDto, where));
				expect(errors).toHaveLength(expectedNError);
			}
		});
	});
});
