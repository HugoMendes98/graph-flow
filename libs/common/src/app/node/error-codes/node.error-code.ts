export enum NodeErrorCode {
	// Note: The codes are chosen arbitrarily.

	/**
	 * When trying to change the kind type of node
	 */
	KIND_TYPE_READONLY = 100,

	/**
	 * When trying to create template of `PARAMETER` behavior
	 */
	NO_TEMPLATE_PARAMETER = 150,

	/** When trying to add inputs to a readonly "node-inputs" (ex: variable (only update)) */
	INPUTS_READONLY_CREATE = 300,
	/** When trying to update inputs from a readonly "node-inputs" (ex: function) */
	INPUTS_READONLY_UPDATE = 301,
	/** When trying to delete inputs from a readonly "node-inputs" (ex: variable (only update)) */
	INPUTS_READONLY_DELETE = 302,
	/** When trying to update inputs from a readonly "node-inputs" (ex: function) */
	OUTPUTS_READONLY_UPDATE = 311
}

/** Error code for readonly inputs */
export type NodeInputReadonlyErrorCode =
	| NodeErrorCode.INPUTS_READONLY_CREATE
	| NodeErrorCode.INPUTS_READONLY_DELETE
	| NodeErrorCode.INPUTS_READONLY_UPDATE;

/** Error code for readonly outputs */
export type NodeOutputReadonlyErrorCode = NodeErrorCode.OUTPUTS_READONLY_UPDATE;
