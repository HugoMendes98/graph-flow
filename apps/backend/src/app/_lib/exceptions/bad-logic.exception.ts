import { UnprocessableEntityException } from "@nestjs/common";

export class BadLogicException extends UnprocessableEntityException {
	public constructor(description: object, cause?: unknown) {
		super("Unprocessable Entity", { cause, description: description as unknown as string });
	}
}
