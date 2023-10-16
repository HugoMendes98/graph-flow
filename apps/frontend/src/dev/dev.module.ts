import { APP_INITIALIZER, NgModule, Provider } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";

import { DevNotifierSnackBar } from "./components/dev-notifier.snack-bar/dev-notifier.snack-bar";
import { DevView } from "./dev.view";
import { devRoutes } from "./views/dev.routes";

export const DevInitializerProvider: Provider = {
	deps: [MatSnackBar],
	multi: true,
	provide: APP_INITIALIZER,
	useFactory: (snackBar: MatSnackBar) => () => {
		const value = window.sessionStorage.getItem(DevNotifierSnackBar.SESSION_KEY);
		if (value === DevNotifierSnackBar.SESSION_NO_MORE) {
			return;
		}
		if (window.location.pathname.startsWith("/_dev")) {
			// Already in the dev page
			return;
		}

		snackBar.openFromComponent(DevNotifierSnackBar, {
			duration: 10000,
			horizontalPosition: "center",
			verticalPosition: "top"
		});
	}
};

@NgModule({
	imports: [
		DevView,
		RouterModule.forChild([
			{
				children: devRoutes,
				component: DevView,
				path: ""
			}
		])
	]
})
export class DevModule {}
