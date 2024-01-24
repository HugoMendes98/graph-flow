import { NodeErrorCode } from "~/lib/common/app/node/error-codes";

import { NodeException } from "./node.exception";

/**
 * An exception when trying to create parameters template
 */
export class NodeNoTemplateParameterException extends NodeException {
	/**
	 * Creates the exception
	 */
	public constructor() {
		super(
			NodeErrorCode.NO_TEMPLATE_PARAMETER,
			"Parameter nodes can not be templates"
		);
	}
}
