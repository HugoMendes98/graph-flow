import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeErrorCode, NodeOutputReadonlyErrorCode } from "~/lib/common/app/node/error-codes";

import { NodeException } from "../../exceptions";

/**
 * An exception when trying to modify readonly node outputs
 */
export class NodeOutputReadonlyException extends NodeException {
	/**
	 * Creates an exception message
	 *
	 * @param errorCode to use
	 * @param behaviorType trying to update its outputs
	 * @returns the message
	 */
	public static createMessage(
		errorCode: NodeOutputReadonlyErrorCode,
		behaviorType: NodeBehaviorType
	) {
		return `A node '${behaviorType}' can not ${this.getVerb(errorCode)} its outputs`;
	}

	private static getVerb(errorCode: NodeOutputReadonlyErrorCode): string {
		switch (errorCode) {
			case NodeErrorCode.OUTPUTS_READONLY_UPDATE:
				return "update";
		}
	}

	/**
	 * Creates the exception
	 *
	 * @param errorCode to use
	 * @param behaviorType trying to update its outputs
	 */
	public constructor(errorCode: NodeOutputReadonlyErrorCode, behaviorType: NodeBehaviorType) {
		super(errorCode, NodeOutputReadonlyException.createMessage(errorCode, behaviorType));
	}
}
