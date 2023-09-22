import { NodeErrorCode } from "~/lib/common/app/node/error-codes";

import { BadLogicException } from "../../_lib/exceptions";

/**
 * An exception to use when related to "graph"
 */
export class NodeException extends BadLogicException {
	/**
	 * Creates the exception
	 *
	 * @param code Error code for the exception
	 * @param message An additional message to the exception
	 */
	public constructor(code: NodeErrorCode, message?: string) {
		super({ code, message });
	}
}
