import { Singleton } from "@heap-code/singleton";
import type { Type } from "@nestjs/common";
import { Type as TypeTransformer } from "class-transformer";
import { IsIn, IsOptional, ValidateNested } from "class-validator";

import { EntityOrder, OrderValues } from "../../../endpoints/_lib";
import { dtoStorage } from "../dto";

/**
 * Generates a [FindQueryOrderDtoOf]{@link FindQueryOrderDtoOf}
 * class with transformations and validations.
 *
 * @param dto The class used to determine the transformation and validations
 * @returns The generated class
 */
export function FindQueryOrderDtoOf<T extends object>(dto: Type<T>): Type<EntityOrder<T>> {
	const generateOrderClass = (source: Type<unknown>) => {
		const keys = dtoStorage.getPropertyKeys(source);

		// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- The class is constructed below
		class OrderDto {}

		for (const key of keys) {
			const decorators: PropertyDecorator[] = [IsOptional()];

			if (dtoStorage.getPropertyOptions(source.prototype as Type<unknown>, key)?.forwardRef) {
				const singleton = new Singleton(() =>
					generateOrderClass(
						dtoStorage.getPropertyType(source.prototype as Type<unknown>, key)
					)
				);

				decorators.push(
					TypeTransformer(() => singleton.get()),
					ValidateNested()
				);
			} else {
				const type = dtoStorage.getPropertyType(source.prototype as Type<unknown>, key);

				// We suppose that Object is a union or a "bad" type definition
				// undefined for null
				if ([String, Date, Number, Object, undefined].includes(type as never)) {
					decorators.push(IsIn(OrderValues));
				} else {
					const nestedType = generateOrderClass(type);
					decorators.push(
						TypeTransformer(() => nestedType),
						ValidateNested()
					);
				}
			}

			Reflect.decorate(decorators, OrderDto.prototype, key);
		}

		return OrderDto;
	};

	return generateOrderClass(dto);
}
