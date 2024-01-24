import { UnprocessableEntityException } from "@nestjs/common";

/**
 * A "bad logic" is when the request is well-formed,
 * but the operation(s) to run does not make sense on the current data.
 *
 * Example: Given data with parent-child relation,
 * 	trying to set an object as its self parent.
 */
export class BadLogicException extends UnprocessableEntityException {
	/**
	 * Creates an exception
	 *
	 * @param description of the exception
	 * @param cause that created this exception
	 */
	public constructor(description: object, cause?: unknown) {
		super("Unprocessable Entity", {
			cause,
			description: description as unknown as string
		});
	}
}
