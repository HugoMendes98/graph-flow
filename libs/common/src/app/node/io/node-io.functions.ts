import { NODE_IO_VOID, NodeIoType, NodeIoValueFromType } from "./node-io.type";

/**
 * Error that occurs when "casting"
 */
export class CastNodeIoValueToException extends Error {
	/**
	 * Creates an exception
	 *
	 * @param type the type to cast to
	 * @param value the value that was being casted
	 * @param cause The previous cause of an error
	 */
	public constructor(
		public readonly type: NodeIoType,
		private readonly value: unknown,
		cause?: unknown
	) {
		let sValue = String(value);
		if (10 < sValue.length) {
			sValue = `${sValue.slice(0, 10)}...`;
		}

		super(`Could not cast '${sValue}' to ${type}`, { cause });
	}
}

/**
 * A
 *
 * @param type target type of the value
 * @param value The value to cast (expected to be a serialized value, from any `node-code`)
 * @throws CastNodeIoValueToException
 * @returns the casted value
 */
export function castNodeIoValueTo<T extends NodeIoType>(
	type: T,
	value: unknown
): NodeIoValueFromType<T> {
	// TODO: remove this? It could be completely omitted
	//	And only use the types as validation for graph modification
	switch (type) {
		case NodeIoType.ANY:
			return value as never;

		case NodeIoType.JSON: {
			if (typeof value === "object") {
				return castNodeIoValueTo(type, JSON.stringify(value));
			}

			try {
				return JSON.parse(value as never) as never;
			} catch (error: unknown) {
				throw new CastNodeIoValueToException(type, value, error);
			}
		}

		case NodeIoType.NUMBER: {
			const casted: NodeIoValueFromType<NodeIoType.NUMBER> =
				Number(value);
			if (Number.isNaN(casted)) {
				break;
			}

			return casted as never;
		}

		case NodeIoType.STRING:
			return String(value) as never;

		case NodeIoType.VOID:
			return NODE_IO_VOID as never;
	}

	throw new CastNodeIoValueToException(type, value);
}
