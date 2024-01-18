// This import must be the first one to use correct tsconfig paths
import "./register-tsconfig";

import { ChildProcess, execSync, spawn } from "child_process";
import { Config } from "jest";
import * as path from "path";
import waitFor from "wait-port";
import { config } from "~/app/backend/app/config.e2e";
import { LoggerTest } from "~/app/backend/test/support/global/logger-test";
import { globalSetup as setupBackend } from "~/app/backend/test/support/global/setup";

import { GlobalThis } from "../global-this.type";

let app: { command: ChildProcess; kill: () => void } | null = null;

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
	} else {
		const command = spawn(
			"nx",
			["run", "backend:serve:test-e2e", "--no-inspect"],
			{
				cwd: path.join(__dirname, "../../../../../"),
				detached: false
			}
		);
		app = {
			command,
			kill: () => {
				if (command.killed) {
					return;
				}

				const output = execSync(
					`pstree -p ${command.pid!} | grep -o '([0-9]\\+)' | grep -o '[0-9]\\+'`
				);
				const ids = output
					.toString()
					.split("\n")
					.filter(pid => pid.trim());

				// FIXME: Nx create subprocess https://github.com/nrwl/nx/issues/11058
				for (const pid of ids.slice().reverse()) {
					execSync(`(kill ${pid} 2>&1) > /dev/null || exit 0`);
				}

				command.kill("SIGTERM");
			}
		};

		command.stdout.on("data", (data: string) =>
			logger.log("backend |", `${data}`)
		);
		command.stderr.on("data", (data: string) =>
			logger.error("backend |", `${data}`)
		);

		logger.log("Waiting for backend");
		await waitFor({
			host: config.host.name,
			port: config.host.port,
			timeout: 30000
		});
	}

	(globalThis as unknown as GlobalThis).jest_config.backend = app;
	logger.emptyLine();
}

export default async function (config: Config) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- One or the other
	await globalSetup({ watch: config.watch || config.watchAll });
}
