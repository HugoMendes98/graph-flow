import { LoggerNamespace } from "@mikro-orm/core/logging";
import { LogLevel } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { PartialDeep } from "type-fest";

/**
 * The whole configuration
 */
export interface Configuration {
	/**
	 * All information related to authentication, most of it for JWT.
	 */
	authentication: {
		/**
		 * The secret string for JWT
		 */
		secret: string;
		/**
		 * Timeout in seconds
		 */
		timeout: number;
	};
	/**
	 * All information related to the database
	 */
	db: {
		/**
		 * Debug mode for Mikro-orm
		 */
		debug: LoggerNamespace[] | boolean;
		/**
		 * Host to connect to
		 */
		host: string;
		/**
		 * Name of the database to use
		 */
		name: string;
		/**
		 * Password used for the db connection
		 */
		password: string;
		/**
		 * Port to connect to
		 */
		port: number;
		/**
		 * Username used for the db connection
		 */
		username: string;
	};
	/**
	 * All information to run the application
	 */
	host: {
		/**
		 * The cors options for the host
		 */
		cors: {
			/**
			 * Configures the `Access-Control-Allow-Origins` CORS header.  See [here for more detail.](https://github.com/expressjs/cors#configuration-options)
			 */
			origin: Exclude<CorsOptions["origin"], undefined>;
		};
		/**
		 * Registers a prefix for every HTTP route path.
		 */
		globalPrefix: string;
		/**
		 * The hostname this application will listen to
		 *
		 * @example "localhost"
		 * @example "0.0.0.0"
		 */
		name: string;
		/**
		 * The port this application will listen to
		 */
		port: number;
	};
	/**
	 * NestJS logger
	 */
	logger: LogLevel[] | boolean;
	/**
	 * Activates the swagger interface
	 */
	swagger: boolean;
}

export type ConfigurationPartial = PartialDeep<Configuration>;
