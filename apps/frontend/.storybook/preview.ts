import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import { applicationConfig, Preview } from "@storybook/angular";
import { ApiTestingModule } from "~/lib/ng/lib/api/testing";

import docJson from "./documentation.json";
import { AppTranslationModule } from "../src/lib/translation";

setCompodocJson(docJson);

export default {
	decorators: [
		applicationConfig({
			providers: [
				importProvidersFrom(
					ApiTestingModule,
					AppTranslationModule,
					BrowserAnimationsModule,
					RouterTestingModule
				)
			]
		})
	],
	parameters: {
		backgrounds: {
			default: "dark",
			values: [
				{ name: "light", value: "#f8f8f8" },
				{ name: "dark", value: "#333333" }
			]
		}
	}
} satisfies Preview;
