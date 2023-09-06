import { MockSeed } from "./mock.seed";

/**
 * An empty db sample
 */
export const EMPTY_SEED = {
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
} as const satisfies MockSeed;
