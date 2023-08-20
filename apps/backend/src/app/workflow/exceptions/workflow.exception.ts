import { WorkflowErrorCode } from "~/lib/common/app/workflow/error-codes";

import { BadLogicException } from "../../_lib/exceptions";

export class WorkflowException extends BadLogicException {
	public constructor(code: WorkflowErrorCode, message?: string) {
		super({
			code,
			message
		});
	}
}
