import Dockerode = require("dockerode");
import { Config } from "jest";

import { LoggerTest } from "./logger-test";
import { config as configE2e } from "../../../src/config.e2e";
import { GlobalThis } from "../global-this.type";

export async function globalSetup(logger: LoggerTest) {
	const docker = new Dockerode();
	const imageTag = "postgres:15-alpine";
	const { name, password, port, username } = configE2e.db;

	const existing = await docker.listContainers().then(containers => {
		for (const container of containers) {
			if (container.Ports.some(p => p.PublicPort === port)) {
				return container;
			}
		}

		return false;
	});

	if (existing) {
		if (existing.Image !== imageTag) {
			throw new Error(
				`An existing container with public port '${port}' was found, but it does not use the image '${imageTag}'`
			);
		}

		logger.log(
			`An existing container with public port '${port}' and image '${imageTag}' was found`
		);
		logger.log(`  It will use the existing one`);

		(globalThis as unknown as GlobalThis).jest_config = {
			container: "existing"
		};
		return;
	}

	logger.log(`Pulling image '${imageTag}'`);
	await new Promise<void>(resolve => {
		void docker.pull(imageTag, (_, stream: NodeJS.ReadableStream) => {
			docker.modem.followProgress(
				stream,
				() => {
					resolve();
				},
				() => {
					logger.log(`[In Progress] Pulling image '${imageTag}'`);
				}
			);
		});
	});

	logger.log(`Creating container`);

	const container = await docker.createContainer({
		Env: [
			`POSTGRES_DB=${name}`,
			`POSTGRES_USER=${username}`,
			`POSTGRES_PASSWORD=${password}`
		],
		HostConfig: {
			PortBindings: {
				"5432/tcp": [
					{
						HostIP: "127.0.0.1",
						HostPort: configE2e.db.port.toString()
					}
				]
			}
		},
		Image: imageTag
	});

	logger.log(`Container '${container.id}' created, now starting`);
	await container.start();

	await new Promise<void>((resolve, reject) => {
		const timeout = 5000;
		const timeoutId = setTimeout(() => {
			reject(
				new Error(
					`Did not succeed to determine if psql is ready in less than ${timeout}ms`
				)
			);
		}, timeout);

		container
			.exec({
				AttachStdout: true,
				Cmd: ["bash", "-c", "while ! pg_isready; do sleep 1; done"]
			})
			.then(async exec => {
				const stream = await exec.start({});
				// `end` does not seem to be called without `data`
				stream.on("data", () => void 0);
				stream.on("end", () => {
					clearTimeout(timeoutId);
					resolve();
				});
			})
			.catch(reject);
	}).catch(async (error: unknown) => {
		await container.stop();
		await container.remove();
		throw error;
	});

	logger.log(`Container running and ready`);
	(globalThis as unknown as GlobalThis).jest_config = { container };
}

export default async function (config: Config) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- One or the other
	const logger = LoggerTest(config.watch || config.watchAll)(
		"[global-setup]"
	);

	logger.emptyLine();
	await globalSetup(logger);
	logger.emptyLine();
}
