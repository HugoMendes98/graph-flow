import { ModuleWithProviders, NgModule } from "@angular/core";

import { API_CLIENT_CONFIG_TOKEN, ApiClient, ApiClientConfig } from "./api.client";
import { CategoryApiModule } from "./category-api";
import { NodeApiModule } from "./node-api";
import { UserApiModule } from "./user-api";
import { WorkflowApiModule } from "./workflow-api";

export interface ApiModuleConfig {
	/**
	 * The configuration for the API client
	 */
	client: ApiClientConfig;
}

@NgModule({
	imports: [ApiClient, CategoryApiModule, NodeApiModule, UserApiModule, WorkflowApiModule]
})
export class ApiModule {
	public static forRoot(config: ApiModuleConfig): ModuleWithProviders<ApiModule> {
		return {
			ngModule: ApiModule,
			providers: [{ provide: API_CLIENT_CONFIG_TOKEN, useValue: config.client }]
		};
	}
}
