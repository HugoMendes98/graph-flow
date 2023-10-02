/**
 * The possible types of node behavior
 */
export enum NodeBehaviorType {
	CODE = "code",
	FUNCTION = "function",
	PARAMETER_IN = "parameter-input",
	PARAMETER_OUT = "parameter-output",
	REFERENCE = "reference",
	TRIGGER = "trigger",
	VARIABLE = "variable"
}

export const NODE_BEHAVIOR_TYPES = [
	NodeBehaviorType.CODE,
	NodeBehaviorType.FUNCTION,
	NodeBehaviorType.PARAMETER_IN,
	NodeBehaviorType.PARAMETER_OUT,
	NodeBehaviorType.REFERENCE,
	NodeBehaviorType.TRIGGER,
	NodeBehaviorType.VARIABLE
] as const satisfies readonly NodeBehaviorType[];
