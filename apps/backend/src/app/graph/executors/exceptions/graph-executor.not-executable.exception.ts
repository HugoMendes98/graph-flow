import { GraphExecutorErrorCode } from "~/lib/common/app/graph/executor/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphExecutorException } from "./graph-executor.exception";

/**
 * An exception when a node-input has no value
 */
export class GraphExecutorNotExecutableException extends GraphExecutorException {
	/**
	 * Creates the exception
	 *
	 * @param nodeId The node that is not executable
	 */
	public constructor(nodeId: EntityId) {
		super(GraphExecutorErrorCode.NODE_NOT_EXECUTABLE, `The ${nodeId} is not executable.`);
	}
}
