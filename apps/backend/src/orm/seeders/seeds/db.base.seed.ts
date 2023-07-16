import { MockedDb } from "../_lib/mocked-db.seeder";

/** Sample date1 */
const date1 = new Date(2020, 1, 1);

/** Sample date2 */
const date2 = new Date(2020, 2, 1);

/** Sample date3 */
const date3 = new Date(2020, 4, 10);

/**
 * The base sample for Seeding the DB.
 */
export const DB_BASE_SEED: MockedDb = {
	categories: [],
	graphArcs: [],
	graphNodeInputs: [],
	graphNodeOutputs: [],
	graphNodes: [],
	graphs: [],
	nodeInputs: [],
	nodeOutputs: [],
	nodes: [],
	users: [
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			email: "admin@host.local",
			firstname: null,
			lastname: null
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date2,

			email: "john.doe@host.local",
			firstname: "John",
			lastname: "Doe"
		},
		{
			_id: 3,

			_created_at: date2,
			_updated_at: date3,

			email: "jane.doe@host.local",
			firstname: "Jane",
			lastname: "Doe"
		}
	],
	workflows: []
};
