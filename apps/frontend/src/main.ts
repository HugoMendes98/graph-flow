import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((error: unknown) => {
		// eslint-disable-next-line no-console -- bootstrap of the application
		console.error("Error while starting the application", error);
	});
