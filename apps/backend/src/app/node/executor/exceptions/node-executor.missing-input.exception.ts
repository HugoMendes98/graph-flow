import { NodeExecutorErrorCode } from "~/lib/common/app/node/executor/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeExecutorException } from "./node-executor.exception";

/**
 * An exception when a node-input has no value
 */
export class NodeExecutorMissingInputException extends NodeExecutorException {
	/**
	 * Creates the exception
	 *
	 * @param inputId The input that has no value
	 */
	public constructor(inputId: EntityId) {
		super(
			NodeExecutorErrorCode.MISSING_INPUT,
			`The ${inputId} has no value.`
		);
	}
}
