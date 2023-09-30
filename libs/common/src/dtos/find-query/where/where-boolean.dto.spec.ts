import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { WhereBooleanDto, WhereBooleanNullableDto } from "./where-boolean.dto";

describe("WhereBooleanDto", () => {
	describe("Validation", () => {
		const validate = (value: object) =>
			validateSync(value, {
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
				whitelist: true
			});

		it("should be valid", () => {
			const wheres: WhereBooleanDto[] = [
				{ $eq: true, $ne: false },
				{ $exists: true },
				{ $exists: false }
			];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereBooleanDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should be valid (with nullable)", () => {
			const wheres: WhereBooleanNullableDto[] = [{ $eq: null }];

			for (const where of wheres) {
				const errors = validate(plainToInstance(WhereBooleanNullableDto, where));
				expect(errors).toHaveLength(0);
			}
		});

		it("should not be valid", () => {
			const toFails: Array<[WhereBooleanDto, number]> = [
				[{ $eq: 1 as unknown as boolean }, 1],
				[{ $eq: null as unknown as boolean }, 1],
				// Values are cast in array (when possible)
				[{ $exists: 2 as unknown as boolean }, 1],
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- For test
				[{ $ne: new Date() as unknown as boolean, a: 2 } as WhereBooleanDto, 2]
			];

			for (const [where, expectedNError] of toFails) {
				const errors = validate(plainToInstance(WhereBooleanDto, where));
				expect(errors).toHaveLength(expectedNError);
			}
		});
	});
});
