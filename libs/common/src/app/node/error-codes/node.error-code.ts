export enum NodeErrorCode {
	// Note: The codes are chosen arbitrarily.

	/**
	 * When trying to change the kind type of node
	 */
	KIND_TYPE_READONLY = 100,

	/**
	 * When trying to create template of `PARAMETER` behavior
	 */
	NO_TEMPLATE_PARAMETER = 150
}
