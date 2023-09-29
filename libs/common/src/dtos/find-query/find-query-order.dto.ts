import { Singleton } from "@heap-code/singleton";
import type { Type } from "@nestjs/common";
import { IntersectionType } from "@nestjs/mapped-types";
import { Expose, plainToInstance, Transform, Type as TypeTransformer } from "class-transformer";
import { IsIn, IsOptional, ValidateNested } from "class-validator";

import { EntityOrder, OrderValues } from "../../endpoints";
import { DtoPropertyOptions, dtoStorage, DtoType } from "../dto";

/** @internal*/
function getPropertyDecorators<T extends object>(
	type: DtoType<T>,
	options: DtoPropertyOptions<object> = {}
): PropertyDecorator[] {
	// We suppose that Object is a union or a "bad" type definition
	// undefined for null
	if ([Boolean, String, Date, Number, Object, undefined].includes(type as never)) {
		return [IsIn(OrderValues)];
	}

	// Due to its laziness, calculated only once and when needed (and avoid circular calls)
	// eslint-disable-next-line no-use-before-define -- Created below
	const baseType = new Singleton(() => FindQueryOrderDtoOf(type as never));
	const { discriminator } = options;

	if (!discriminator) {
		return [TypeTransformer(() => baseType.get()), ValidateNested()];
	}

	// Same as above
	const discriminatedType = new Singleton(() =>
		discriminator.subTypes.reduce(
			// TODO: remove `IntersectionType` and do it "manually"
			// eslint-disable-next-line no-use-before-define -- Created below
			(intersected, { value }) => IntersectionType(intersected, FindQueryOrderDtoOf(value)),
			baseType.get()
		)
	);
	return [
		Transform(({ key, obj }) => {
			const value = (obj as Record<string, unknown>)[key];
			return value === undefined
				? undefined
				: plainToInstance(discriminatedType.get(), value);
		}),
		ValidateNested()
	];
}

/**
 * Generates a [FindQueryOrderDtoOf]{@link FindQueryOrderDtoOf}
 * class with transformations and validations.
 *
 * @param source The class used to determine the transformation and validations
 * @returns The generated class
 */
export function FindQueryOrderDtoOf<T extends object>(source: DtoType<T>): Type<EntityOrder<T>> {
	// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- The class is constructed below
	class OrderDto {}

	for (const key of dtoStorage.getPropertyKeys(source)) {
		const type = dtoStorage.getPropertyType(source.prototype as Type<unknown>, key);
		const options = dtoStorage.getPropertyOptions<object>(source.prototype as never, key);

		Reflect.decorate(
			[Expose(), IsOptional(), ...getPropertyDecorators(type, options)],
			OrderDto.prototype,
			key
		);
	}

	Object.defineProperty(OrderDto, "name", { value: `${OrderDto.name}${source.name}` });
	return OrderDto;
}
