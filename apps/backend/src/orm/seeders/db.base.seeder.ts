import { MockedDbSeeder } from "./_lib/mocked-db.seeder";
import { DB_BASE_SEED } from "./seeds";

/**
 * DB Seeder with base sample for seeding.
 */
export class DbBaseSeeder extends MockedDbSeeder {
	/**
	 * @inheritDoc
	 */
	protected readonly db = DB_BASE_SEED;
}
