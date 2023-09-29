import { ArgumentMetadata, Injectable, ValidationError, ValidationPipe } from "@nestjs/common";
import { ValidationPipeOptions } from "@nestjs/common/pipes/validation.pipe";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { ValidatorOptions } from "class-validator";
import { deepmerge } from "deepmerge-ts";
import { transformOptions, validatorOptions } from "~/lib/common/options";
import { jsonify } from "~/lib/common/utils/jsonify";

/**
 * The validation pipe for the application.
 * It extends the default [pipe]{@link ValidationPipe}
 * by converting the values on query values.
 *
 * Used for HTTP.
 */
@Injectable()
export class AppValidationPipe extends ValidationPipe {
	/**
	 * Creates the pipe
	 *
	 * @param options for validation
	 */
	public constructor(options?: ValidationPipeOptions) {
		super(
			deepmerge(
				{
					...validatorOptions,
					transform: true,
					transformOptions: transformOptions
				},
				// To override default options
				options ?? {}
			)
		);
	}

	/** @inheritDoc */
	public override async transform(value: unknown, metadata: ArgumentMetadata) {
		if (metadata.type === "custom" || metadata.type === "param") {
			return super.transform(value, metadata);
		}

		if (metadata.type === "query" && metadata.metatype) {
			// Only enable the implicit conversions for query params (even if it does the transformation 2 times)
			// So it can be more easily used in the query parameters when writing a query
			// TODO: remove (and re-add the HTTPQueryDecoder?)
			value = plainToInstance(metadata.metatype, value, {
				...this.transformOptions,
				enableImplicitConversion: true
			});

			// Need to re-serialize to use the correct types below
			value = jsonify(value);
		}

		return instanceToPlain(await super.transform(value, metadata), transformOptions) as never;
	}

	/** @inheritDoc */
	public override validate(
		object: object,
		validatorOptions?: ValidatorOptions
	): Promise<ValidationError[]> | ValidationError[] {
		return super.validate(object, validatorOptions);
	}
}
