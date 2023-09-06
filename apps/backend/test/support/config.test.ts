import { ConfigurationPartial } from "../../src/configuration";

export const configTest = {
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
