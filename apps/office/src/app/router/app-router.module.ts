import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { APP_ROUTES } from "../views/app.routes";

@NgModule({
	exports: [RouterModule],
	imports: [
		RouterModule.forRoot(APP_ROUTES, {
			initialNavigation: "enabledBlocking"
		})
	]
})
export class AppRouterModule {}
