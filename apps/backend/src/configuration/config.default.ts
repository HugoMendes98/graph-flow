import { Configuration } from "./configuration.interface";

/**
 * Theses are the default values for the configuration
 */
export const configDefault: Configuration = {
	authentication: {
		secret: "Change Me",
		timeout: 60 * 60 * 4 // 4 hours
	},
	db: {
		debug: false,
		host: "localhost",
		name: "nna",
		password: "M1fmx9Tef2dq5UXN",
		port: 5432,
		username: "nna"
	},
	host: {
		cors: {
			origin: [
				/\/\/127.0.0.[0-9]{1,3}/,
				/\/\/192.168.[0-9]{1,3}.[0-9]{1,3}/,
				/\/\/localhost(:[0-9]{1,5})+/
			]
		},
		globalPrefix: "api",
		name: "localhost",
		port: 3000
	},
	logger: ["debug", "error", "warn"],
	swagger: true
};
