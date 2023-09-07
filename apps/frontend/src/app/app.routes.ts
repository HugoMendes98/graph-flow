import { Routes } from "@angular/router";

import { authGuard } from "./auth/auth.guard";

export const APP_ROUTES: Routes = [
	{
		loadChildren: () =>
			import("./auth/views/auth-routing.module").then(m => m.AuthRoutingModule),
		path: "auth"
	},
	{
		canActivate: [authGuard],
		loadChildren: () =>
			import("./workflow/views/workflow-routing.module").then(m => m.WorkflowRoutingModule),
		path: "workflows"
	},
	{
		loadComponent: () => import("./_views/not-found/not-found.view").then(m => m.NotFoundView),
		path: "**"
	}
];
