import { Route } from "@angular/router";

import { IndexView } from "./index/index.view";
import { StyleguideView } from "./styleguide/styleguide.view";

export const devRoutes: Route[] = [
	{ component: IndexView, path: "" },
	{ component: StyleguideView, path: "styleguide" }
];
