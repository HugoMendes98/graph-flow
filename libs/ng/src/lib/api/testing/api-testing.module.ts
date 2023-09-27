import { NgModule } from "@angular/core";

import { ApiModule } from "../api.module";

@NgModule({
	imports: [ApiModule.forRoot({ client: { url: "/_e2e/api" } })]
	// TODO: HTTP interceptor to mock the backend
})
export class ApiTestingModule {}
