import { Routes } from "@angular/router";

import { GroupsView } from "./groups/groups.view";
import { IndexView } from "./index/index.view";
import { NotFoundView } from "./not-found/not-found.view";

export const APP_ROUTES: Routes = [
	{ component: IndexView, path: "" },
	{ component: GroupsView, path: "groups" },
	{ component: NotFoundView, path: "**" }
];
