import { ModuleWithProviders, NgModule } from "@angular/core";

import { API_CLIENT_CONFIG_TOKEN, ApiClient, ApiClientConfig } from "./api.client";
import { AuthApiService } from "./auth-api";
import { CategoryApiService } from "./category-api";
import { GraphApiService } from "./graph-api";
import { NodeApiService } from "./node-api";
import { UserApiService } from "./user-api";
import { WorkflowApiService } from "./workflow-api";

export interface ApiModuleConfig {
	/**
	 * The configuration for the API client
	 */
	client: ApiClientConfig;
}

@NgModule({
	imports: [ApiClient],
	providers: [
		AuthApiService,
		CategoryApiService,
		GraphApiService,
		NodeApiService,
		UserApiService,
		WorkflowApiService
	]
})
export class ApiModule {
	public static forRoot(config: ApiModuleConfig): ModuleWithProviders<ApiModule> {
		return {
			ngModule: ApiModule,
			providers: [{ provide: API_CLIENT_CONFIG_TOKEN, useValue: config.client }]
		};
	}
}
