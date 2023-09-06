import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ApiModule } from "~/lib/ng/lib/api";

import { AuthInterceptor } from "./auth.interceptor";
import { AuthService } from "./auth.service";

@NgModule({
	imports: [ApiModule],
	providers: [
		AuthInterceptor,
		AuthService,
		{ multi: true, provide: HTTP_INTERCEPTORS, useExisting: AuthInterceptor }
	]
})
export class AuthModule {}
