import { ValidatorOptions } from "class-validator";

/**
 * The default [options]{@link ValidatorOptions}
 * when using the `class-validator` [validate]{@link validateSync} functions.
 */
export const validatorOptions = Object.freeze<ValidatorOptions>({
	forbidNonWhitelisted: true,
	forbidUnknownValues: true,
	skipNullProperties: false,
	whitelist: true
});
