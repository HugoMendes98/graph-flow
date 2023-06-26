import { Property } from "@mikro-orm/core";
import { I18nDto } from "~/app/common/dtos/_lib/i18n";
import { type TranslationDto } from "~/app/common/dtos/_lib/translation";

import { I18nProperty } from "./i18n.decorator";
import { EntityBase } from "../entity";

export abstract class I18nEntity extends EntityBase implements I18nDto {
	/**
	 * @inheritDoc
	 */
	@Property({ unique: true })
	public _name!: string;

	/**
	 * @inheritDoc
	 */
	@I18nProperty()
	public name: TranslationDto = {};
}
