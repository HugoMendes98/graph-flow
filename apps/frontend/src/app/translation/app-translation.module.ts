import { TranslationModule as NgTranslationModule } from "~/lib/ng/lib/translation";

import { LOCALE_EN, LOCALE_FR } from "../../locale";

export const AppTranslationModule = NgTranslationModule.forRoot({
	locales: {
		en: LOCALE_EN,
		fr: LOCALE_FR
	}
});
