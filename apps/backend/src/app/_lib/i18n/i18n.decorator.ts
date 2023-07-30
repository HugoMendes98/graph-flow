import { JsonType, Property } from "@mikro-orm/core";
import { TranslationDto } from "~/lib/common/dtos/translation";

/**
 * @returns a Mikro-orm decorator for a `I18n` property
 */
export function I18nProperty(): PropertyDecorator {
	return (target, propertyKey) => {
		const cleanTranslation = ({
			[propertyKey]: translation
		}: Record<typeof propertyKey, TranslationDto>) =>
			Object.fromEntries(Object.entries(translation).filter(([, value]) => !!value));

		// Apply the decorator with the given functions
		Property({
			default: JSON.stringify({}),
			onCreate: cleanTranslation,
			onUpdate: cleanTranslation,
			type: JsonType
		})(target, propertyKey as string);
	};
}
