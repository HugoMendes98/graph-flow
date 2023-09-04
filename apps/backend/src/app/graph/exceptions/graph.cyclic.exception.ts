import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";

import { GraphException } from "./graph.exception";

/**
 * An exception when the graph contains a cycle
 */
export class GraphCyclicException extends GraphException {
	/**
	 * Creates the exception
	 *
	 * @param message Additional message to the exception
	 */
	public constructor(message?: string) {
		super(GraphErrorCode.CYCLIC, message);
	}
}
