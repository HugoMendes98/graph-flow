import { WorkflowErrorCode } from "~/lib/common/app/workflow/error-codes";

import { BadLogicException } from "../../_lib/exceptions";

/**
 * Exception for anything related to a Workflow
 */
export class WorkflowException extends BadLogicException {
	/**
	 * Creates the exception
	 *
	 * @param code error code
	 * @param message additional message to add
	 */
	public constructor(code: WorkflowErrorCode, message?: string) {
		super({
			code,
			message
		});
	}
}
