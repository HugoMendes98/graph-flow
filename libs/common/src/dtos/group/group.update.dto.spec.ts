import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { GroupUpdateDto } from "./group.update.dto";
import { transformOptions, validatorOptions } from "../../options";

describe("GroupUpdateDto", () => {
	const transform = (object: object) => plainToInstance(GroupUpdateDto, object, transformOptions);
	const validate = (object: object) => validateSync(object, validatorOptions);

	describe("Validation (simple)", () => {
		// Use this `describe` to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.

		it("should be valid", () => {
			for (const toValidate of [
				{},
				{ _name: "MyNewName" },
				{ description: {} },
				{ name: { en: "abc" } },
				{ name: { en: "abc", fr: "dce" } },
				{ __creator: null },
				{ __creator: 1 }
			] satisfies GroupUpdateDto[]) {
				expect(validate(transform(toValidate))).toHaveLength(0);
			}
		});

		it("should be invalid (with correct types)", () => {
			for (const toValidate of [
				{ _name: "" },
				{ __creator: 0 },
				{ __creator: -1 }
			] satisfies GroupUpdateDto[]) {
				expect(validate(transform(toValidate))).not.toHaveLength(0);
			}
		});
	});
});
