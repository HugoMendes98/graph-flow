// This import must be the first one to use correct tsconfig paths
import "./register-tsconfig";
// And this one to override the app configuration
import "~/app/backend/test/support/setup";

import { INestApplication } from "@nestjs/common";
import { Config } from "jest";
import { bootstrap } from "~/app/backend/app/bootstrap";
import { configTest } from "~/app/backend/test/support/config.test";
import { LoggerTest } from "~/app/backend/test/support/global/logger-test";
import { globalSetup as setupBackend } from "~/app/backend/test/support/global/setup";

import { e2eAppHook } from "./e2e-app.hook";
import { GlobalThis } from "../global-this.type";

let app: INestApplication | null = null;

export interface GlobalSetupParams {
	prefix?: string;
	watch?: boolean;
}
export async function globalSetup(params?: GlobalSetupParams) {
	const { prefix = "[e2e-backend-setup]", watch = false } = params ?? {};
	const logger = LoggerTest(watch)(prefix).emptyLine().emptyLine();

	await setupBackend(logger);
	logger.line();

	if (app) {
		if (!watch) {
			throw new Error("The app was already set when setting up!");
		}

		// Would be better to not do it,`jest` uses the same "node session" for this file
		// and Mikro-orm changes its metadata when creating an app.
		// So the app can not be recreated
		logger.log(`Backend already set up is watch mode`);
	} else {
		logger.log(`Bootstrapping backend app`);
		app = await bootstrap();

		logger.log(`Add E2E app hooks`);
		e2eAppHook(app);

		const { globalPrefix, name, port } = configTest.host;
		await app.listen(port, name);
		logger.log(`E2E app running and listening at 'http://${name}:${port}${globalPrefix}'`);
	}

	(globalThis as unknown as GlobalThis).jest_config.backend = app;
	logger.emptyLine();
}

export default async function (config: Config) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- One or the other
	await globalSetup({ watch: config.watch || config.watchAll });
}
