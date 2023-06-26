import { NgModule } from "@angular/core";

import { ApiClient } from "./api.client";
import { GroupApiModule } from "./group-api";
import { UserApiModule } from "./user-api";

@NgModule({
	imports: [ApiClient, GroupApiModule, UserApiModule]
})
export class ApiModule {}
