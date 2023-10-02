import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeErrorCode, NodeInputReadonlyErrorCode } from "~/lib/common/app/node/error-codes";

import { NodeException } from "../../exceptions";

/**
 * An exception when trying to modify readonly node inputs
 */
export class NodeInputReadonlyException extends NodeException {
	/**
	 * Creates an exception message
	 *
	 * @param errorCode to use
	 * @param behaviorType trying to update its inputs
	 * @returns the message
	 */
	public static createMessage(
		errorCode: NodeInputReadonlyErrorCode,
		behaviorType: NodeBehaviorType
	) {
		return `A node '${behaviorType}' can not ${this.getVerb(errorCode)} its inputs`;
	}

	private static getVerb(errorCode: NodeInputReadonlyErrorCode): string {
		switch (errorCode) {
			case NodeErrorCode.INPUTS_READONLY_CREATE:
				return "create";
			case NodeErrorCode.INPUTS_READONLY_UPDATE:
				return "update";
			case NodeErrorCode.INPUTS_READONLY_DELETE:
				return "delete";
		}
	}

	/**
	 * Creates the exception
	 *
	 * @param errorCode to use
	 * @param behaviorType trying to update its inputs
	 */
	public constructor(errorCode: NodeInputReadonlyErrorCode, behaviorType: NodeBehaviorType) {
		super(errorCode, NodeInputReadonlyException.createMessage(errorCode, behaviorType));
	}
}
