import { DbTestSample } from "~/app/backend/test/db-test";

export const E2E_ENDPOINT_DB_SEEDING = "/_e2e_/db/seed";

export interface E2eEndpointDbSeedingBody {
	sample: DbTestSample;
}
