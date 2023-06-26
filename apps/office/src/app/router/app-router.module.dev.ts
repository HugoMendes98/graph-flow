import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DevInitializerProvider, DevModule } from "../../dev/dev.module";
import { APP_ROUTES } from "../views/app.routes";

@NgModule({
	exports: [RouterModule],
	imports: [
		RouterModule.forRoot([{ loadChildren: () => DevModule, path: "_dev" }, ...APP_ROUTES], {
			initialNavigation: "enabledBlocking"
		})
	],
	providers: [DevInitializerProvider]
})
export class AppRouterModule {}
