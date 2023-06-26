import { IsString, MinLength } from "class-validator";

import { I18nProperty } from "./i18n.decorator";
import { DtoProperty } from "../dto";
import { EntityDto } from "../entity";
import { TranslationDto } from "../translation";

/**
 * The min length for the unique name property
 */
export const NAME_UNIQUE_MIN_LENGTH = 2;

/**
 * Base DTO for entities that have an i18n name
 */
export class I18nDto extends EntityDto {
	/**
	 * The unique name of this entity
	 */
	@DtoProperty()
	@IsString()
	@MinLength(NAME_UNIQUE_MIN_LENGTH)
	public _name!: string;

	/**
	 * The translated name
	 */
	@I18nProperty()
	public name!: TranslationDto;
}
