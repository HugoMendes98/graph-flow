import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { GroupCreateDto } from "./group.create.dto";
import { transformOptions, validatorOptions } from "../../options";

describe("GroupCreateDto", () => {
	const transform = (object: object) => plainToInstance(GroupCreateDto, object, transformOptions);
	const validate = (object: object) => validateSync(object, validatorOptions);

	describe("Validation (simple)", () => {
		// Use this `describe` to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.

		it("should be valid", () => {
			for (const toValidate of [
				{ _name: "MyNewName" },
				{ _name: "default-name", description: {} },
				{ _name: "default-name", name: { en: "abc" } },
				{ _name: "default-name", name: { en: "abc", fr: "dce" } },
				{ __creator: null, _name: "default-name" },
				{ __creator: 1, _name: "default-name" }
			] satisfies GroupCreateDto[]) {
				expect(validate(transform(toValidate))).toHaveLength(0);
			}
		});

		it("should be invalid (with correct types)", () => {
			for (const toValidate of [
				{ _name: "" },
				{ __creator: 0, _name: "default-name" },
				{ __creator: -1, _name: "default-name" }
			] satisfies GroupCreateDto[]) {
				expect(validate(transform(toValidate))).not.toHaveLength(0);
			}
		});
	});
});
