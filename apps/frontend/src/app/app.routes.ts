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
			import("./node/views/node-routing.module").then(m => m.NodeRoutingModule),
		path: "nodes"
	},
	{
		canActivate: [authGuard],
		loadChildren: () =>
			import("./workflow/views/workflow-routing.module").then(m => m.WorkflowRoutingModule),
		path: "workflows"
	},
	{
		canActivate: [authGuard],
		loadComponent: () => import("./home/views/home/home.view").then(m => m.HomeView),
		path: ""
	},
	{
		loadComponent: () => import("./_views/not-found/not-found.view").then(m => m.NotFoundView),
		path: "**"
	}
];
