import { Routes } from "@angular/router";

import { WorkflowView } from "./workflow/workflow.view";

/**
 * The routes for workflow
 */
export const WORKFLOW_ROUTES: Routes = [{ component: WorkflowView, path: ":workflowId" }];
