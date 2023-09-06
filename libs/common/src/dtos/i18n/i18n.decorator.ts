import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { DtoProperty } from "../dto";
import { TranslationDto } from "../translation";

/**
 * Decorator for an I18n Property. It uses Validation and Transformation.
 *
 * @returns A decorator
 */
export function I18nProperty(): PropertyDecorator {
	return applyDecorators(
		DtoProperty({ type: () => TranslationDto }),
		ValidateNested(),
		Type(() => TranslationDto)
	);
}
