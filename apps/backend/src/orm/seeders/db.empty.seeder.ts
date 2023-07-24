import { MockedDbSeeder } from "./_lib/mocked-db.seeder";
import { DB_EMPTY_SEED } from "./seeds";

/**
 * DB Seeder with empty sample for seeding.
 */
export class DbEmptySeeder extends MockedDbSeeder {
	/**
	 * @inheritDoc
	 */
	protected readonly db = DB_EMPTY_SEED;
}
