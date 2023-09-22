import { ValidatorOptions } from "class-validator";

/**
 * The default [options]{@link ValidatorOptions}
 * when using the `class-validator` [validate]{@link validateSync} functions.
 */
export const validatorOptions = Object.freeze<ValidatorOptions>({
	// Thanks to class-transformer unwanted properties will be removed
	// forbidNonWhitelisted: true,

	forbidUnknownValues: true,
	skipNullProperties: false,
	whitelist: true
});
