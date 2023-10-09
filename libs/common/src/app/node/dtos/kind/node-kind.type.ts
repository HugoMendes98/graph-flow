export enum NodeKindType {
	/**
	 * A template is not linked to a graph and can more easily be reused
	 * 	(preferably by "code", "function" or even "variable" behaviors)
	 */
	TEMPLATE = "template",
	/**
	 * The node is part of a graph and has position
	 */
	VERTEX = "vertex"
}
