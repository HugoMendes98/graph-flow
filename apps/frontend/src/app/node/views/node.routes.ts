import { Routes } from "@angular/router";

import { NodeView } from "./node/node.view";
import { NodesView } from "./nodes/nodes.view";

/**
 * The routes for node
 */
export const NODE_ROUTES: Routes = [
	{ component: NodesView, path: "" },
	{ component: NodeView, path: ":nodeId" }
];
