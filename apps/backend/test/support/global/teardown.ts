import { Config } from "jest";

import { LoggerTest } from "./logger-test";
import { GlobalThis } from "../global-this.type";

export async function globalTeardown(logger: LoggerTest) {
	const global = globalThis as unknown as GlobalThis;

	if (!global.jest_config?.container) {
		throw new Error("No jest global-setup config or container found");
	}
	if (global.jest_config.container === "existing") {
		logger.log(`Use of an existing container; nothing to do`);
		return;
	}

	const { container } = global.jest_config;

	logger.log(`Stopping container '${container.id}'`);
	await container.stop();

	logger.log(`Removing`);
	await container.remove();
}

export default async function (config: Config) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- One or the other
	const logger = LoggerTest(config.watch || config.watchAll)(
		"[global-teardown]"
	);

	logger.emptyLine();
	await globalTeardown(logger);
	logger.emptyLine();
}
