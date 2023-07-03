import { NgModule } from "@angular/core";

import { ApiClient } from "./api.client";
import { UserApiModule } from "./user-api";

@NgModule({
	imports: [ApiClient, UserApiModule]
})
export class ApiModule {}
