import { ModuleWithProviders, NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslationLanguage } from "~/lib/common/dtos/translation";

import { TranslationControlErrorPipe, TranslationHttpErrorPipe } from "./pipes";
import { TranslationLoader, TranslationLocales } from "./translation.loader";
import { TranslationService } from "./translation.service";

/**
 * Configuration when using the `TranslationModule`.
 */
export interface TranslationModuleConfig {
	/**
	 * Use the given fallback if the wanted translation is not found.
	 */
	fallback?: TranslationLanguage;
	/**
	 * Complete/override default locales
	 */
	locales: TranslationLocales;
}

@NgModule({
	declarations: [TranslationControlErrorPipe, TranslationHttpErrorPipe],
	exports: [
		TranslateModule,
		TranslationControlErrorPipe,
		TranslationHttpErrorPipe
	],
	imports: [TranslateModule],
	providers: [TranslationService]
})
export class TranslationModule {
	public static forRoot(
		config: TranslationModuleConfig
	): ModuleWithProviders<TranslateModule> {
		const module = TranslateModule.forRoot({
			defaultLanguage: "en" satisfies TranslationLanguage,
			isolate: false,
			loader: {
				provide: TranslateLoader,
				useValue: new TranslationLoader(config.locales, config.fallback)
			}
		});

		module.ngModule = TranslationModule;
		return module;
	}
}
