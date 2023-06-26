import axios from "axios";
import { MockedDb } from "~/app/backend/app/orm/seeders/_lib/mocked-db.seeder";
import { DB_BASE_SEED } from "~/app/backend/app/orm/seeders/seeds";
import { DbTestHelper, DbTestSample } from "~/app/backend/test/db-test";
import { configTest } from "~/app/backend/test/support/config.test";
import { Singleton } from "~/app/common/utils/singleton";

import { E2E_ENDPOINT_DB_SEEDING, E2eEndpointDbSeedingBody } from "../e2e.endpoints";

const { name, port } = configTest.host;
const baseURL = `http://${name}:${port}`;

const dbSamples: Record<DbTestSample, MockedDb> = {
	base: DB_BASE_SEED
};

export class DbE2eHelper implements Omit<DbTestHelper, "close"> {
	private static readonly helpers = new Map(
		Object.entries(dbSamples).map(([sample, db]) => [
			sample,
			new Singleton(() => new DbE2eHelper(sample as DbTestSample, db))
		])
	);

	public static getHelper(sample: DbTestSample) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- created from existing data
		return this.helpers.get(sample)!.get();
	}

	protected constructor(private readonly sample: DbTestSample, public readonly db: MockedDb) {}

	public async refresh(): Promise<void> {
		return axios.get(E2E_ENDPOINT_DB_SEEDING, {
			baseURL,
			params: { sample: this.sample } satisfies E2eEndpointDbSeedingBody
		});
	}
}
