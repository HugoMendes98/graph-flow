import { INestApplication } from "@nestjs/common";
import { HttpServer } from "@nestjs/common/interfaces/http/http-server.interface";
import { Request, Response } from "express";
import { DbTestHelper, isDbTestSampleValid } from "~/app/backend/test/db-test";

import { E2E_ENDPOINT_DB_SEEDING, E2eEndpointDbSeedingBody } from "../e2e.endpoints";

/**
 * Add some special routes for a `e2e` use.
 *
 * @param app The application to add the hooks
 */
export function e2eAppHook(app: INestApplication) {
	const httpAdapter = app.getHttpAdapter() as HttpServer<Request, Response>;

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

		new DbTestHelper(app, { sample })
			.refresh()
			.then(() => res.send({ ok: true }))
			.catch(() => sendKo(500));
	});
}
