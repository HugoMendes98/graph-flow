import { NodeExecutorErrorCode } from "~/lib/common/app/node/executor/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeExecutorException } from "./node-executor.exception";

/**
 * An exception when a node-input has no value
 */
export class NodeExecutorNotExecutableException extends NodeExecutorException {
	/**
	 * Creates the exception
	 *
	 * @param nodeId The node that is not executable
	 */
	public constructor(nodeId: EntityId) {
		super(NodeExecutorErrorCode.NOT_EXECUTABLE, `The ${nodeId} is not executable.`);
	}
}
