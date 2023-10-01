import { ConfigurationPartial } from "./configuration";
import { DbTestSample } from "../test/db-test";

export const E2E_ENDPOINT_DB_SEEDING = "/_e2e_/db/seed";

export interface E2eEndpointDbSeedingBody {
	sample: DbTestSample;
}

/**
 * This is a special configuration used only with e2e testing (backend + frontend)
 */
export const config = {
	authentication: { timeout: 60 * 60 * 24 },
	db: {
		host: "127.0.0.1",
		name: "_db-test",
		password: "_db-test",
		port: 32321,
		username: "_db-test"
	},
	host: {
		// The e2e instance can be used in frontend:e2e:watch mode
		cors: { origin: /\/\/localhost(:[0-9]{1,5})+/ },
		globalPrefix: "/e2e/api",
		name: "127.0.0.1",
		port: 32300
	},
	logger: false,
	swagger: false
} as const satisfies ConfigurationPartial;
