export enum GraphErrorCode {
	/**
	 * When an arc is set between 2 graph-nodes that are not in the same graph
	 */
	ARC_DIFFERENT_GRAPH = 100,
	/**
	 * The graph contains (or will contain with a modification) a cycle
	 */
	CYCLIC = 200
}
