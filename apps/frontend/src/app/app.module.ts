import { ApplicationRef, DoBootstrap, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule } from "~/lib/ng/lib/api";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AppRouterModule } from "../lib/router";
import { AppTranslationModule } from "../lib/translation";

@NgModule({
	imports: [
		AppComponent,
		ApiModule.forRoot({ client: environment.backend }),
		AppRouterModule,
		AppTranslationModule,
		BrowserAnimationsModule,
		BrowserModule
	]
})
export class AppModule implements DoBootstrap {
	public ngDoBootstrap(appRef: ApplicationRef) {
		appRef.bootstrap(AppComponent);
	}
}
