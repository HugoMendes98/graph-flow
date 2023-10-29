import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Writable } from "type-fest";
import { authOptions } from "~/lib/common/options";

import { AppValidationPipe } from "./app/_lib/app-validation.pipe";
import { AppModule } from "./app/app.module";
import { Configuration, getConfiguration } from "./configuration";
import packageJSON from "../../../package.json";

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
	app.use(cookieParser.default())
		.useGlobalPipes(new AppValidationPipe())
		.setGlobalPrefix(globalPrefix)
		.enableShutdownHooks();

	if (config.swagger) {
		const options = new DocumentBuilder()
			.addBearerAuth()
			.addCookieAuth(authOptions.cookies.name, {
				description:
					"As described <a href='https://swagger.io/docs/specification/authentication/cookie-authentication/' target='_blank' >here</a>, it does not work with the Swagger UI." +
					"<br>However, the <i>Curl</i> example works fine.",
				type: "apiKey"
			})
			.setTitle(`${packageJSON.name} API`)
			.setVersion(packageJSON.version)
			.build();

		const document = SwaggerModule.createDocument(app, options);
		SwaggerModule.setup(globalPrefix, app, document);
	}

	return app;
}
