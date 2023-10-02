import { NodeBehaviorType } from "../../dtos/behaviors/node-behavior.type";

/**
 * Returns true when the inputs for a node can not be manually created.
 *
 * @param behavior of the node to test
 * @returns if the inputs of the node with the given behavior are readonly
 */
export function areNodeInputsReadonlyOnCreate(behavior: NodeBehaviorType): boolean {
	switch (behavior) {
		case NodeBehaviorType.CODE:
			return false;
		case NodeBehaviorType.FUNCTION:
		case NodeBehaviorType.PARAMETER_IN:
		case NodeBehaviorType.PARAMETER_OUT:
		case NodeBehaviorType.TRIGGER:
		case NodeBehaviorType.VARIABLE:
		case NodeBehaviorType.REFERENCE:
			return true;
	}
}

/**
 * Returns true when the inputs for a node can not be manually updated.
 *
 * @param behavior of the node to test
 * @returns if the inputs of the node with the given behavior are readonly
 */
export function areNodeInputsReadonlyOnUpdate(behavior: NodeBehaviorType): boolean {
	switch (behavior) {
		case NodeBehaviorType.CODE:
		case NodeBehaviorType.PARAMETER_OUT:
			return false;
		case NodeBehaviorType.FUNCTION:
		case NodeBehaviorType.PARAMETER_IN:
		case NodeBehaviorType.TRIGGER:
		case NodeBehaviorType.VARIABLE:
		case NodeBehaviorType.REFERENCE:
			return true;
	}
}

/**
 * Returns true when the inputs for a node can not be manually deleted.
 *
 * @param behavior of the node to test
 * @returns if the inputs of the node with the given behavior are readonly
 */
export function areNodeInputsReadonlyOnDelete(behavior: NodeBehaviorType): boolean {
	switch (behavior) {
		case NodeBehaviorType.CODE:
			return false;
		case NodeBehaviorType.FUNCTION:
		case NodeBehaviorType.PARAMETER_IN:
		case NodeBehaviorType.PARAMETER_OUT:
		case NodeBehaviorType.TRIGGER:
		case NodeBehaviorType.VARIABLE:
		case NodeBehaviorType.REFERENCE:
			return true;
	}
}
