import { NotFoundError } from "@mikro-orm/core";
import { ArgumentsHost, Catch, NotFoundException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

/**
 * Filter Translating `Mikro-orm`'s [NotFoundError]{@link NotFoundError}
 * to HTTP [NotFoundException]{@link NotFoundException}.
 */
@Catch(NotFoundError)
export class NotFoundFilter extends BaseExceptionFilter {
	/**
	 * @inheritDoc
	 */
	public override catch(exception: NotFoundError, host: ArgumentsHost) {
		const { message } = exception;

		super.catch(
			new NotFoundException(
				message.match(/\({ _id: '?\d+'? }\)$/)
					? `The ressource ('${message}') was not found.`
					: "A ressource was not found.",
				{
					cause: exception,
					description: (exception as unknown as { detail: string }).detail
				}
			),
			host
		);
	}
}
