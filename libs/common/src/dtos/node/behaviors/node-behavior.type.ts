/**
 * The possible types of node behavior
 */
export enum NodeBehaviorType {
	CODE = "code",
	FUNCTION = "function",
	PARAMETER_IN = "parameter-input",
	PARAMETER_OUT = "parameter-output",
	TRIGGER = "trigger",
	VARIABLE = "variable"
}

export type NodeBehaviorParameterType =
	| NodeBehaviorType.PARAMETER_IN
	| NodeBehaviorType.PARAMETER_OUT
	| NodeBehaviorType.VARIABLE;
