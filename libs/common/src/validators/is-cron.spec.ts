import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { IsCron } from "./is-cron";
import { transformOptions } from "../options";

describe("IsCron", () => {
	class TestRef {
		@IsCron()
		public readonly cron: unknown;
	}

	const validate = (value: object) =>
		validateSync(plainToInstance(TestRef, value, transformOptions), {
			forbidNonWhitelisted: true,
			forbidUnknownValues: true
		}).length === 0;

	it("should be valid", () => {
		for (const test of [
			{ cron: "* * * * *" },
			{ cron: "1 2 3 4 5" },
			{ cron: "* 10/12 * * *" }
		] satisfies TestRef[]) {
			expect(validate(test)).toBeTrue();
		}
	});

	it("should not be valid", () => {
		for (const test of [{ cron: 1 }, { cron: "* * * *" }, { cron: null }] satisfies TestRef[]) {
			expect(validate(test)).toBeFalse();
		}
	});
});
