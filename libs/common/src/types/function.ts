/**
 * Change a function type by adding parameters at the beginning of the exiting ones
 */
export type UnshiftParameters<FN, PARAMS extends unknown[]> = FN extends (
	...args: infer P
) => infer R
	? (...args: [...PARAMS, ...P]) => R
	: never;

/**
 * Change a function type by adding parameters at the end of the exiting ones
 */
export type PushParameters<FN, PARAMS extends unknown[]> = FN extends (...args: infer P) => infer R
	? (...args: [...P, ...PARAMS]) => R
	: never;
