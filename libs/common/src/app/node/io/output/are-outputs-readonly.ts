import { NodeBehaviorType } from "../../dtos/behaviors/node-behavior.type";

/**
 * Returns true when the outputs for a node can not be manually updated.
 *
 * @param behavior of the node to test
 * @returns if the outputs of the node with the given behavior are readonly
 */
export function areNodeOutputsReadonlyOnUpdate(
	behavior: NodeBehaviorType
): boolean {
	switch (behavior) {
		case NodeBehaviorType.CODE:
		case NodeBehaviorType.PARAMETER_IN:
		case NodeBehaviorType.VARIABLE:
			return false;
		case NodeBehaviorType.FUNCTION:
		case NodeBehaviorType.PARAMETER_OUT:
		case NodeBehaviorType.TRIGGER:
		case NodeBehaviorType.REFERENCE:
			return true;
	}
}
