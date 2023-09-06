import { Environment } from "./environment.interface";

/**
 * This is the environment when running e2e tests
 */
export const environment: Environment = {
	backend: {
		url: "http://127.0.0.1:32300/e2e/api"
	}
};
