export enum GraphErrorCode {
	// Note: The codes are chosen arbitrarily.

	/**
	 * When an arc is set between 2 graph-nodes that are not in the same graph
	 */
	ARC_DIFFERENT_GRAPH = 10,
	/**
	 * The graph contains (or will contain with a modification) a cycle
	 */
	CYCLIC = 20,

	/**
	 * A `node-function` graph can not contain any `node-trigger`
	 *
	 * Note: This is not a "pure-graph" error.
	 */
	NODE_TRIGGER_IN_FUNCTION = 110,
	/**
	 * A `workflow` can only have 1 `node-trigger`.
	 * 0 `node-trigger` means an invalid `workflow` but correct graph.
	 *
	 * Note: This is not a "pure-graph" error.
	 */
	NODE_TRIGGER_IN_WORKFLOW = 115
}
