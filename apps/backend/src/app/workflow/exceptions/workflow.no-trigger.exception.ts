import { WorkflowErrorCode } from "~/lib/common/app/workflow/error-codes";

import { WorkflowException } from "./workflow.exception";

/**
 * An exception when the workflow does not contain a workflow.
 */
export class WorkflowNoTriggerException extends WorkflowException {
	/**
	 * Creates the exception
	 *
	 * @param message additional message to add
	 */
	public constructor(message?: string) {
		super(WorkflowErrorCode.NO_TRIGGER, message);
	}
}
