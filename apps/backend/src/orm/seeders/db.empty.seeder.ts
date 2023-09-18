import { EMPTY_SEED } from "~/lib/common/seeds";

import { MockedDbSeeder } from "./_lib/mocked-db.seeder";

/**
 * DB Seeder with empty sample for seeding.
 */
export class DbEmptySeeder extends MockedDbSeeder {
	/** @inheritDoc */
	protected readonly db = EMPTY_SEED;
}
