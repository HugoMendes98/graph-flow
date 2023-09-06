import { TranslateLoader } from "@ngx-translate/core";
import { deepmerge } from "deepmerge-ts";
import { of } from "rxjs";
import { JsonObject } from "type-fest/source/basic";
import { TranslationLanguage } from "~/lib/common/dtos/translation";

import { LOCALE_LIB_EN } from "./locale";

// TODO: move this to lib, so it can be used on backend too
export type TranslationLocales = Record<TranslationLanguage, JsonObject>;

/**
 * The loader for the translation module
 */
export class TranslationLoader implements TranslateLoader {
	/**
	 * Locales of the application
	 */
	private readonly locales: TranslationLocales;

	/**
	 * Creates the Translation loader
	 *
	 * @param locales to overwrite the lib ones
	 * @param fallback the language to use when the current one is not defined
	 */
	public constructor(
		locales: TranslationLocales,
		private readonly fallback: TranslationLanguage = "en"
	) {
		this.locales = { en: deepmerge(LOCALE_LIB_EN, locales.en) };
	}

	/**
	 * Get the locale for a given lang
	 *
	 * @param lang the lang to search the locale
	 * @returns the locale for the given lang or the fallback if it doesn't exist
	 */
	public getTranslation(lang: string) {
		return of(this.locales[lang] ?? this.locales[this.fallback]);
	}
}
