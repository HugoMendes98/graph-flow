import { TranslateLoader } from "@ngx-translate/core";
import { deepmerge } from "deepmerge-ts";
import { of } from "rxjs";
import { JsonObject } from "type-fest/source/basic";
import { TranslationLanguage } from "~/lib/common/dtos/translation";

import { LOCALE_LIB_EN } from "./locale";

// TODO: move this to lib, so it can be used on backend too
export type TranslationLocales = Record<TranslationLanguage, JsonObject>;

export class TranslationLoader implements TranslateLoader {
	private readonly locales: TranslationLocales;

	public constructor(
		locales: TranslationLocales,
		private readonly fallback: TranslationLanguage = "en"
	) {
		this.locales = { en: deepmerge(LOCALE_LIB_EN, locales.en) };
	}

	public getTranslation(lang: string) {
		return of(this.locales[lang] ?? this.locales[this.fallback]);
	}
}
