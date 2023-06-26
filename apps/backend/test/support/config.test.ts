import { ConfigurationPartial } from "../../src/configuration";

export const configTest = {
	db: {
		host: "127.0.0.1",
		name: "_db-test",
		password: "_db-test",
		port: 32321,
		username: "_db-test"
	},
	host: {
		cors: { origin: "127.0.0.1" },
		globalPrefix: "/e2e/api",
		name: "127.0.0.1",
		port: 32300
	},
	logger: false,
	swagger: false
} as const satisfies ConfigurationPartial;
