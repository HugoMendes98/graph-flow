import { MockSeed } from "./mock.seed";

/**
 * An empty db sample
 */
export const EMPTY_SEED = {
	categories: [],
	graph: {
		arcs: [],
		graphs: [],
		nodes: []
	},
	users: [],
	workflows: []
} as const satisfies MockSeed;
