import { TranslationModule as NgTranslationModule } from "~/app/ng/lib/translation";

import { LOCALE_EN, LOCALE_FR } from "../locale";

// TODO: move/change (this is temporary)
export const TranslationModule = NgTranslationModule.forRoot({
	locales: {
		en: LOCALE_EN,
		fr: LOCALE_FR
	}
});
