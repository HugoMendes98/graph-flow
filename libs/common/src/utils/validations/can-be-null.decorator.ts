import { ValidateIf, ValidationOptions } from "class-validator";

// Need to import this if the decorator is the first to be used on a property
import "reflect-metadata";

/**
 * Allows the value `null` with other validations from `class-validator`.
 *
 * It disables other validations for this (allowing only null)
 *
 * @example ```typescript
 * class Example {
 *     \@CanBeNull()
 *     \@IsNumber()
 *     public prop: null | number;
 * }
 * ```
 * @param validationOptions The additional options for the validation
 * @returns The decorator
 */
export function CanBeNull(
	validationOptions?: ValidationOptions
): PropertyDecorator {
	return ValidateIf((_, value) => value !== null, validationOptions);
}
