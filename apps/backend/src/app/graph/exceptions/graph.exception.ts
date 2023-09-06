import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";

import { BadLogicException } from "../../_lib/exceptions";

/**
 * An exception to use when related to "graph"
 */
export class GraphException extends BadLogicException {
	/**
	 * Creates the exception
	 *
	 * @param code Error code for the exception
	 * @param message An additional message to the exception
	 */
	public constructor(code: GraphErrorCode, message?: string) {
		super({
			code,
			message
		});
	}
}
