import { Routes } from "@angular/router";

import { LoginView } from "./login/login.view";
import { ProfileView } from "./profile/profile.view";
import { authGuard } from "../auth.guard";

/**
 * The routes for auth
 */
export const AUTH_ROUTES: Routes = [
	{ component: LoginView, path: "login" },
	{ canActivate: [authGuard], component: ProfileView, path: "profile" }
];
