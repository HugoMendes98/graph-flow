import { TranslationModule as NgTranslationModule } from "~/lib/ng/lib/translation";

import { LOCALE_EN } from "../../locale";

export const AppTranslationModule = NgTranslationModule.forRoot({
	locales: { en: LOCALE_EN }
});
