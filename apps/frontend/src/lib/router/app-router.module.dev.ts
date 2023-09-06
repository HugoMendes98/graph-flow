import { NgModule } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";

import { APP_ROUTES } from "../../app/app.routes";
import { DevInitializerProvider, DevModule } from "../../dev/dev.module";

@NgModule({
	exports: [RouterModule],
	imports: [
		MatSnackBarModule,
		RouterModule.forRoot([{ loadChildren: () => DevModule, path: "_dev" }, ...APP_ROUTES], {
			bindToComponentInputs: true
		})
	],
	providers: [DevInitializerProvider]
})
export class AppRouterModule {}
