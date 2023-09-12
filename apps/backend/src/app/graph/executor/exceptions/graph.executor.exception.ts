import { GraphExecutorErrorCode } from "~/lib/common/app/graph/executor/error-codes";

import { BadLogicException } from "../../../_lib/exceptions";

/**
 * An exception to use when related to the node-executor
 */
export class GraphExecutorException extends BadLogicException {
	/**
	 * Creates the exception
	 *
	 * @param code Error code for the exception
	 * @param message An additional message to the exception
	 */
	public constructor(code: GraphExecutorErrorCode, message?: string) {
		super({ code, message });
	}
}
