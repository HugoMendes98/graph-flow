import { ONLY_NODES_SEED } from "~/lib/common/seeds";

import { MockedDbSeeder } from "./_lib/mocked-db.seeder";

/**
 * DB Seeder with only 1 type of node (and minimal additional content)
 */
export class DbOnlyNodesSeeder extends MockedDbSeeder {
	/** @inheritDoc */
	protected readonly db = ONLY_NODES_SEED;
}
