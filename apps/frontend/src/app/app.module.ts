import { APP_INITIALIZER, ApplicationRef, DoBootstrap, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule } from "~/lib/ng/lib/api";

import { AppComponent } from "./app.component";
import { AppRouteReuseStrategy } from "./app.route-reuse-strategy";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { environment } from "../environments/environment";
import { AppRouterModule } from "../lib/router";
import { AppTranslationModule } from "../lib/translation";

@NgModule({
	imports: [
		AppComponent,
		AppRouterModule,
		ApiModule.forRoot({ client: environment.backend }),
		AppTranslationModule,
		AuthModule,
		BrowserAnimationsModule,
		BrowserModule
	],
	providers: [
		AppRouteReuseStrategy.PROVIDER,
		{
			deps: [AuthInterceptor, AuthService],
			multi: true,
			provide: APP_INITIALIZER,
			useFactory: (interceptor: AuthInterceptor, service: AuthService) => () =>
				interceptor.runUnprotected(() =>
					service.refresh().catch((error: unknown) => {
						if (!AuthService.isAnUnauthorizedError(error)) {
							throw error;
						}
					})
				)
		}
	]
})
export class AppModule implements DoBootstrap {
	public ngDoBootstrap(appRef: ApplicationRef) {
		appRef.bootstrap(AppComponent);
	}
}
