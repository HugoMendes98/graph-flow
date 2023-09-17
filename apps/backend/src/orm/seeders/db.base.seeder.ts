import { BASE_SEED } from "~/lib/common/seeds";

import { MockedDbSeeder } from "./_lib/mocked-db.seeder";

/**
 * DB Seeder with base sample for seeding.
 */
export class DbBaseSeeder extends MockedDbSeeder {
	/** @inheritDoc */
	protected readonly db = BASE_SEED;
}
