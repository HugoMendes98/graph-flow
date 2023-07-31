import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { APP_ROUTES } from "../../app/app.routes";

@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(APP_ROUTES, { bindToComponentInputs: true })]
})
export class AppRouterModule {}
