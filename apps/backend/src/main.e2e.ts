import { MikroORM, RequestContext } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { HttpServer } from "@nestjs/common/interfaces/http/http-server.interface";
import { Request, Response } from "express";

import { bootstrap } from "./bootstrap";
import { E2E_ENDPOINT_DB_SEEDING, E2eEndpointDbSeedingBody } from "./config.e2e";
import { getConfiguration } from "./configuration";
import { DbTestHelper, isDbTestSampleValid } from "../test/db-test";

// This is a special bootstrap used only with e2e testing (backend + frontend)

bootstrap()
	.then(async app => {
		const { host } = getConfiguration();

		const httpAdapter = app.getHttpAdapter() as HttpServer<Request, Response>;
		const orm = app.get(MikroORM);

		httpAdapter.get(E2E_ENDPOINT_DB_SEEDING, (req, res) => {
			const sendKo = (code: number) => {
				res.status(code);
				res.json({ ok: false });
			};

			const { sample } = req.query as Partial<Record<keyof E2eEndpointDbSeedingBody, string>>;

			if (!sample || !isDbTestSampleValid(sample)) {
				sendKo(400);
				return;
			}

			void RequestContext.createAsync(orm.em, () =>
				new DbTestHelper(app, { sample })
					.refresh()
					.then(() => res.send({ ok: true }))
					.catch(() => sendKo(718))
			);
		});

		await RequestContext.createAsync(orm.em, () =>
			new DbTestHelper(app, { sample: "base" }).refresh()
		);
		await app.listen(host.port, host.name);
		Logger.log(`🚀 Application is running on: ${await app.getUrl()}/${host.globalPrefix}`);
	})
	.catch((error: unknown) => {
		// eslint-disable-next-line no-console -- bootstrap of the application
		console.error("Error while starting the server", error);
	});
