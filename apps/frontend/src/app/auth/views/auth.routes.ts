import { Routes } from "@angular/router";

import { LoginView } from "./login/login.view";

/**
 * The routes for auth
 */
export const AUTH_ROUTES: Routes = [{ component: LoginView, path: "login" }];
