import { MockedDb } from "../_lib/mocked-db.seeder";

/**
 * An empty db sample
 */
export const DB_EMPTY_SEED: MockedDb = {
	categories: [],
	graph: {
		graphArcs: [],
		graphNodeInputs: [],
		graphNodeOutputs: [],
		graphNodes: [],
		graphs: []
	},
	node: {
		nodeInputs: [],
		nodeOutputs: [],
		nodes: []
	},
	users: [],
	workflows: []
};
