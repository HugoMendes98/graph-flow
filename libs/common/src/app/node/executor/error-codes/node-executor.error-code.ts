export enum NodeExecutorErrorCode {
	// Note: The codes are chosen arbitrarily.

	/**
	 * When an input of a node does not have a value
	 */
	MISSING_INPUT = 10,

	/**
	 * When a node is not executable
	 */
	NODE_NOT_EXECUTABLE = 20
}
