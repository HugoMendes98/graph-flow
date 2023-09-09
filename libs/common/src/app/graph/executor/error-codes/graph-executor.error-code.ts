export enum GraphExecutorErrorCode {
	// Note: The codes are chosen arbitrarily.

	/**
	 * When an input of a node does not have a value
	 */
	NODE_MISSING_INPUT = 10,

	/**
	 * When a node is not executable
	 */
	NODE_NOT_EXECUTABLE = 20
}
