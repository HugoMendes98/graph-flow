import { ApiClientConfig } from "~/lib/ng/lib/api";

/**
 * The environment defines the variables that never changes once the application is launched.
 */
export interface Environment {
	/**
	 * Define the configuration to communicate with the backend API
	 */
	backend: ApiClientConfig;
}
