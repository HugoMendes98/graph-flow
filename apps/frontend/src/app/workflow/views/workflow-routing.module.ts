import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { WORKFLOW_ROUTES } from "./workflow.routes";

@NgModule({
	imports: [RouterModule.forChild(WORKFLOW_ROUTES)]
})
export class WorkflowRoutingModule {}
