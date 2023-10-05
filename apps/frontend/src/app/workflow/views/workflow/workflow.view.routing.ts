import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkflowView, WorkflowViewRouteData } from "./workflow.view";

// To not fail compodoc parsing
const data1 = { graph: false } satisfies WorkflowViewRouteData;
const data2 = { graph: true } satisfies WorkflowViewRouteData;

const ROUTES: Routes = [
	{ component: WorkflowView, data: data1, path: "" },
	{ component: WorkflowView, data: data2, path: "graph" }
];

@NgModule({ imports: [RouterModule.forChild(ROUTES)] })
export class WorkflowViewRouting {}
