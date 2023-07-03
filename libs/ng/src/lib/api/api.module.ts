import { NgModule } from "@angular/core";

import { ApiClient } from "./api.client";
import { CategoryApiModule } from "./category-api";
import { NodeApiModule } from "./node-api";
import { UserApiModule } from "./user-api";
import { WorkflowApiModule } from "./workflow-api";

@NgModule({
	imports: [ApiClient, CategoryApiModule, NodeApiModule, UserApiModule, WorkflowApiModule]
})
export class ApiModule {}
