import { Logger } from "@nestjs/common";

import { bootstrap } from "./bootstrap";
import { getConfiguration } from "./configuration";

bootstrap()
	.then(async app => {
		const { host } = getConfiguration();

		await app.listen(host.port, host.name);
		Logger.log(`🚀 Application is running on: ${await app.getUrl()}/${host.globalPrefix}`);
	})
	.catch((error: unknown) => {
		// eslint-disable-next-line no-console -- bootstrap of the application
		console.error("Error while starting the server", error);
	});
