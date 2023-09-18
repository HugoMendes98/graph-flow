import { Routes } from "@angular/router";

import { WorkflowView } from "./workflow/workflow.view";
import { WorkflowsView } from "./workflows/workflows.view";

/**
 * The routes for workflow
 */
export const WORKFLOW_ROUTES: Routes = [
	{ component: WorkflowsView, path: "" },
	{ component: WorkflowView, path: ":workflowId" }
];
