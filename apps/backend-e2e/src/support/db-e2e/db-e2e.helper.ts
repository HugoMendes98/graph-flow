import { Singleton } from "@heap-code/singleton";
import axios from "axios";
import { config as ConfigE2e } from "~/app/backend/app/config.e2e";
import { DbTestHelper, DbTestSample } from "~/app/backend/test/db-test";
import { BASE_SEED, EMPTY_SEED, MockSeed, ONLY_NODES_SEED } from "~/lib/common/seeds";

import { E2E_ENDPOINT_DB_SEEDING, E2eEndpointDbSeedingBody } from "../e2e.endpoints";

const { name, port } = ConfigE2e.host;
const baseURL = `http://${name}:${port}`;

const dbSamples: Record<DbTestSample, MockSeed> = {
	base: BASE_SEED,
	empty: EMPTY_SEED,
	"only-nodes": ONLY_NODES_SEED
};

export class DbE2eHelper implements Omit<DbTestHelper, "close" | "transformTo"> {
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

	protected constructor(
		private readonly sample: DbTestSample,
		public readonly db: MockSeed
	) {}

	public async refresh(): Promise<void> {
		return axios.get(E2E_ENDPOINT_DB_SEEDING, {
			baseURL,
			params: { sample: this.sample } satisfies E2eEndpointDbSeedingBody
		});
	}
}
