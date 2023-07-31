import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";

import { GraphException } from "../../exceptions";

/**
 * An exception when more than 1 `node-trigger` is added to a workflow
 */
export class GraphNodeTriggerInWorkflowException extends GraphException {
	public constructor() {
		super(
			GraphErrorCode.NODE_TRIGGER_IN_WORKFLOW,
			"A workflow can not have more than 1 `node-trigger`"
		);
	}
}
