import { Environment } from "./environment.interface";

/**
 * Default environment for development
 */
export const environment: Environment = {
	backend: {
		// Use of the webpack proxy
		url: "/api"
	}
};
