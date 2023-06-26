import { APP_INITIALIZER, NgModule, Provider } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterModule } from "@angular/router";

import { StyleguideButtonsComponent } from "./components/styleguide/styleguide-buttons/styleguide-buttons.component";
import { DevView } from "./dev.view";
import { devRoutes } from "./views/dev.routes";
import { IndexView } from "./views/index/index.view";
import { StyleguideView } from "./views/styleguide/styleguide.view";
import { ComponentsModule } from "../app/components/components.module";

export const DevInitializerProvider: Provider = {
	multi: true,
	provide: APP_INITIALIZER,
	useFactory: () => () => {
		// TODO: use a snack/dialog/popup/... to notify that this page exists
		// eslint-disable-next-line no-console -- TODO
		console.log("!! `_dev` page available !!");
	}
};

@NgModule({
	declarations: [DevView, IndexView, StyleguideButtonsComponent, StyleguideView],
	imports: [
		ComponentsModule,
		RouterModule.forChild([
			{
				children: devRoutes,
				component: DevView,
				path: ""
			}
		]),
		MatDividerModule,
		MatExpansionModule
	]
})
export class DevModule {}
