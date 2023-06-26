import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Writable } from "type-fest";

import { AppValidationPipe } from "./app/_lib/app-validation.pipe";
import { AppModule } from "./app/app.module";
import { Configuration, getConfiguration } from "./configuration";

/**
 * Prepare the application with all its parameters,
 * but do not start it.
 *
 * @returns The bootstrapped app
 */
export async function bootstrap() {
	// Only to satisfy TS in the following use
	const config = getConfiguration() as Writable<Configuration>;
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: config.host.cors.origin
		},
		logger: config.logger === true ? undefined : config.logger
	});

	const { globalPrefix } = config.host;
	app.useGlobalPipes(new AppValidationPipe()).setGlobalPrefix(globalPrefix).enableShutdownHooks();

	if (config.swagger) {
		const options = new DocumentBuilder().build();
		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup(globalPrefix, app, document);
	}

	return app;
}
