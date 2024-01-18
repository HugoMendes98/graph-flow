import { Config } from "jest";
import { LoggerTest } from "~/app/backend/test/support/global/logger-test";
import { globalTeardown as teardownBackend } from "~/app/backend/test/support/global/teardown";

import { GlobalThis } from "../global-this.type";

export interface GlobalTeardownParams {
	prefix?: string;
	watch?: boolean;
}
export async function globalTeardown(params?: GlobalTeardownParams) {
	const { prefix = "[e2e-backend-teardown]", watch = false } = params ?? {};
	const logger = LoggerTest(watch)(prefix).emptyLine();

	const global = globalThis as unknown as GlobalThis;

	const app = global.jest_config.backend;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- If an error was not catch in `setup`
	if (!app) {
		throw new Error("No backend application found");
	}

	if (watch) {
		logger.log(`Backend not closed in watch mode`);

		for (const eventType of [
			`exit`,
			`SIGINT`,
			`SIGUSR1`,
			`SIGUSR2`,
			`uncaughtException`,
			`SIGTERM`
		]) {
			process.on(eventType, () => {
				(
					globalThis as unknown as GlobalThis
				).jest_config.backend.kill();
			});
		}
	} else {
		logger.log(`Closing backend app`);
		app.kill();
	}

	await teardownBackend(logger.line());
	logger.emptyLine();
}

export default async function (config: Config) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- One or the other
	await globalTeardown({ watch: config.watch || config.watchAll });
}
