import { JsonValue } from "type-fest";

export enum NodeIoType {
	// TODO: Nullable (in input/output parameters)

	ANY = "any",
	JSON = "json",
	NUMBER = "number",
	STRING = "string",
	VOID = "void"
}

/**
 * Constant for the VOID {@link NodeIoType}
 */
export const NODE_IO_VOID: unique symbol = Symbol.for(NodeIoType.VOID);

/**
 * Value type for {@link NodeIoType.VOID}
 */
export type NodeIoValueVoid = typeof NODE_IO_VOID;
/**
 * Value type for {@link NodeIoType.JSON}
 */
export type NodeIoValueJSON = JsonValue;
/**
 * All possible type for {@link NodeIoType}
 */
export type NodeIoValue = NodeIoValueJSON | NodeIoValueVoid | number | string;

/**
 * Type of the value from a given Io type
 */
export type NodeIoValueFromType<T extends NodeIoType> = T extends NodeIoType.ANY
	? NodeIoValue
	: T extends NodeIoType.JSON
		? NodeIoValueJSON
		: T extends NodeIoType.NUMBER
			? number
			: T extends NodeIoType.STRING
				? string
				: T extends NodeIoType.VOID
					? NodeIoValueVoid
					: never;
