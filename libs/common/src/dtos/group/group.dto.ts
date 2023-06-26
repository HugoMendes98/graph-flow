import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../_lib/dto";
import { EntityId } from "../_lib/entity";
import { I18nDto, I18nProperty } from "../_lib/i18n";
import { TranslationDto } from "../_lib/translation";
/**
 * DTO for groups entities
 */
export class GroupDto extends I18nDto {
	/**
	 * FK to the user who created this group
	 */
	@DtoProperty({ nullable: true, type: () => Number })
	@IsNumber()
	@Min(1)
	public __creator!: EntityId | null;

	/**
	 * The translated description of group
	 */
	@I18nProperty()
	public description!: TranslationDto;
}
