import { NodeErrorCode } from "~/lib/common/app/node/error-codes";

import { NodeException } from "./node.exception";

/**
 * An exception when someone tries to change the node-kind type
 */
export class NodeReadonlyKindTypeException extends NodeException {
	/**
	 * Creates the exception
	 */
	public constructor() {
		super(NodeErrorCode.KIND_TYPE_READONLY, "The kind-type of a node can not be changed");
	}
}
