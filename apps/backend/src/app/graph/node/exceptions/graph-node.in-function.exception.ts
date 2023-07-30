import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";

import { GraphException } from "../../exceptions";

/**
 * An exception when a `node-trigger` is added to a `node-function
 */
export class GraphNodeInFunctionException extends GraphException {
	public constructor() {
		super(
			GraphErrorCode.NODE_TRIGGER_IN_FUNCTION,
			"A `node-function` can not contain any `node-trigger`s"
		);
	}
}
