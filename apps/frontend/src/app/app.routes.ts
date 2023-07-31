import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
	{
		loadComponent: () => import("./_views/not-found/not-found.view").then(m => m.NotFoundView),
		path: "**"
	}
];
