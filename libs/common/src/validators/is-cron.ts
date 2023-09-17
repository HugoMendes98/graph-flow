import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import cron from "cron-validate";

/**
 * Unique name for `class-validator` register
 */
export const IS_CRON = "isCron";

/**
 * Tests if a value is a CRON
 *
 * @param value the value to test
 * @returns If the given value is a valid CRON
 */
export function isCron(value: unknown): value is string {
	return typeof value === "string" && cron(value).isValid();
}

/**
 * Checks if the value is a CRON string
 *
 * @param validationOptions
 * @returns the decorator to apply
 */
export function IsCron(validationOptions?: ValidationOptions) {
	return ValidateBy(
		{
			name: IS_CRON,
			validator: {
				defaultMessage: buildMessage(prefix => `${prefix}$property must be a valid cron`),
				validate: isCron
			}
		},
		validationOptions
	);
}
