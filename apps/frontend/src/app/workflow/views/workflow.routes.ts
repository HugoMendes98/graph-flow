import { Routes } from "@angular/router";

import { WorkflowsView } from "./workflows/workflows.view";

/**
 * The routes for workflow
 */
export const WORKFLOW_ROUTES: Routes = [
	{ component: WorkflowsView, path: "" },
	{
		// This component is bigger
		loadChildren: () =>
			import("./workflow/workflow.view.routing").then(
				m => m.WorkflowViewRouting
			),
		path: ":workflowId"
	}
];
