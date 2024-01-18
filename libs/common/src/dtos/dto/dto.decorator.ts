import type { Type } from "@nestjs/common";
import { Expose, Type as TypeTransformer } from "class-transformer";

import { dtoStorage } from "./dto.storage";
import { DtoPropertyOptions } from "./dto.types";
import { CanBeNull } from "../../utils/validations";

/**
 * Decorator to apply to any DTO property that
 * can be returned, transformed or filtered.
 *
 * @param options Options of this decorator
 * @returns A decorator
 */
export function DtoProperty<T, P extends Extract<keyof T, string>>(
	options?: DtoPropertyOptions<T, P>
): PropertyDecorator {
	const { discriminator, expose = true, nullable, type } = options ?? {};

	return (target, propertyKey) => {
		const constructor = target.constructor as Type<unknown>;
		dtoStorage.addPropertyKey(constructor, propertyKey);
		dtoStorage.storePropertyOptions(
			target as Type<unknown>,
			propertyKey,
			options as never
		);

		if (type) {
			// TODO: an option to disable?
			TypeTransformer(type as never, {
				discriminator: discriminator as never,
				keepDiscriminatorProperty: true
			})(target, propertyKey);
		}
		if (expose) {
			Expose(expose === true ? undefined : expose)(target, propertyKey);
		}
		if (nullable) {
			CanBeNull()(target, propertyKey);
		}
	};
}
