import { GraphExecutorErrorCode } from "~/lib/common/app/graph/executor/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphExecutorException } from "./graph-executor.exception";

/**
 * An exception when a node-input has no value
 */
export class GraphExecutorMissingInputException extends GraphExecutorException {
	/**
	 * Creates the exception
	 *
	 * @param inputId The input that has no value
	 */
	public constructor(inputId: EntityId) {
		super(GraphExecutorErrorCode.NODE_MISSING_INPUT, `The ${inputId} has no value.`);
	}
}
