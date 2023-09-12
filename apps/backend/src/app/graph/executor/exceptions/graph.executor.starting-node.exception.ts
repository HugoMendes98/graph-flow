import { GraphExecutorErrorCode } from "~/lib/common/app/graph/executor/error-codes";

import { GraphExecutorException } from "./graph.executor.exception";

/**
 * An exception when theres is an error with the starting nodes
 */
export class GraphExecutorStartingNodeException extends GraphExecutorException {
	/**
	 * Creates the exception
	 *
	 */
	public constructor() {
		super(
			GraphExecutorErrorCode.STARTING_NODE_NOT_FOUND,
			"Not all starting nodes found on the graph (avoid duplicated IDs or empty)"
		);
	}
}
