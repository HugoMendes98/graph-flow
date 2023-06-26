import type { Type } from "@nestjs/common";

import { dtoStorage } from "./dto.storage";
import { DtoPropertyOptions } from "./dto.types";
import { CanBeNull } from "../../../utils/validations";

/**
 * Decorator to apply to any DTO property that
 * can be returned, transformed or filtered.
 *
 * @param options Options of this decorator
 * @returns A decorator
 */
export function DtoProperty(options?: DtoPropertyOptions): PropertyDecorator {
	dtoStorage.validatePropertyOptions(options);

	const { nullable } = options ?? {};

	return (target, propertyKey) => {
		const constructor = target.constructor as Type<unknown>;
		dtoStorage.addPropertyKey(constructor, propertyKey);
		dtoStorage.storePropertyOptions(target as Type<unknown>, propertyKey, options);

		if (nullable) {
			CanBeNull()(target, propertyKey);
		}
	};
}
