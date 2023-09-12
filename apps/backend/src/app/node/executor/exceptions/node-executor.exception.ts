import { NodeExecutorErrorCode } from "~/lib/common/app/node/executor/error-codes";

import { BadLogicException } from "../../../_lib/exceptions";

/**
 * An exception to use when related to the node-executor
 */
export class NodeExecutorException extends BadLogicException {
	/**
	 * Creates the exception
	 *
	 * @param code Error code for the exception
	 * @param message An additional message to the exception
	 */
	public constructor(code: NodeExecutorErrorCode, message?: string) {
		super({ code, message });
	}
}
