import { marker } from "@colsen1991/ngx-translate-extract-marker";
import { TranslationModule as NgTranslationModule } from "~/lib/ng/lib/translation";

import { LOCALE_EN } from "../../locale";

// Always keep these keys in the locale file
marker("formats.date");
marker("formats.datetime");
marker("formats.time");

export const AppTranslationModule = NgTranslationModule.forRoot({
	locales: { en: LOCALE_EN }
});
