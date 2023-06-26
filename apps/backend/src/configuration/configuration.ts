import { deepmerge } from "deepmerge-ts";
import { ReadonlyDeep } from "type-fest";

import { configDefault } from "./config.default";
import { Configuration, ConfigurationPartial } from "./configuration.interface";
import { config } from "../config";

/**
 * The "singleton" configuration
 */
let _conf: ReadonlyDeep<Configuration> | null = null;

/**
 * Set the configuration for the app.
 *
 * @param config The partial configuration to set
 * @throws {Error} When the configuration is already set
 * @returns The configuration
 */
export function _setConfiguration(config: ConfigurationPartial) {
	if (_conf) {
		throw new Error("Configuration already set");
	}

	return (_conf = Object.freeze(deepmerge(configDefault, config) as ReadonlyDeep<Configuration>));
}

/**
 * Returns The configuration
 *
 * @returns The configuration
 */
export function getConfiguration(): ReadonlyDeep<Configuration> {
	if (_conf === null) {
		return _setConfiguration(config);
	}

	return _conf;
}
