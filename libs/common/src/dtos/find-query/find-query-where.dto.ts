import { Singleton } from "@heap-code/singleton";
import type { Type } from "@nestjs/common";
import { Expose, plainToInstance, Transform, Type as TypeTransformer } from "class-transformer";
import {
	IsArray,
	isDateString,
	isObject,
	IsOptional,
	NotEquals,
	ValidateNested
} from "class-validator";

import {
	WhereDateDto,
	WhereDateNullableDto,
	WhereNumberDto,
	WhereNumberNullableDto,
	WhereStringDto,
	WhereStringNullableDto
} from "./where";
import { EntityFilter, EntityFilterLogicalOperators } from "../../endpoints";
import { DtoPropertyOptions, dtoStorage, DtoType } from "../dto";

export const UNKNOWN_DISCRIMINATED_TYPE = Symbol("unknown-type");

// Gets the "base" DTO for a given type
/** @internal */
function getWhereDtoType(type: DtoType, options: DtoPropertyOptions<object> = {}) {
	const { nullable } = options;

	switch (type) {
		case Date:
			return nullable ? WhereDateNullableDto : WhereDateDto;
		case Number:
			return nullable ? WhereNumberNullableDto : WhereNumberDto;
		case String:
			return nullable ? WhereStringNullableDto : WhereStringDto;
	}

	// eslint-disable-next-line no-use-before-define -- created below
	return generateWhereType(type, class NestedWhereDto {});
}

/** @internal */
function transformWhereDto<T extends object>(
	typeSingleton: Singleton<DtoType<T>>,
	value: unknown,
	options: DtoPropertyOptions<object> = {}
): unknown {
	if (value === undefined) {
		return value;
	}

	// No need to get the type when undefined
	const sourceType = typeSingleton.get();

	// For "Primitive" types
	switch (
		!isObject(value) &&
		(sourceType as unknown as typeof Date | typeof Number | typeof String)
	) {
		// Get back to this function with an object (for transformation)
		case Date:
			return transformWhereDto(
				typeSingleton,
				{
					$eq: isDateString(value) ? new Date(value as string) : (value as never)
				} satisfies WhereDateDto,
				options
			);
		case Number:
			return transformWhereDto(
				typeSingleton,
				{ $eq: value === null ? null : +value } satisfies WhereNumberNullableDto,
				options
			);
		case String:
			return transformWhereDto(
				typeSingleton,
				{ $eq: value as string } satisfies WhereStringDto,
				options
			);

		case false:
			break;
	}

	const { discriminator } = options;
	if (value !== null && discriminator) {
		const { property, subTypes } = discriminator;
		const discriminatedProperty = value[property];
		const propertyType = typeof discriminatedProperty;

		// Only narrow type if the discriminator is "usable"
		if (propertyType === "boolean" || propertyType === "number" || propertyType === "string") {
			const subType = subTypes.find(({ name }) => name === discriminatedProperty);
			if (subType) {
				return plainToInstance(getWhereDtoType(subType.value), value);
			}

			return UNKNOWN_DISCRIMINATED_TYPE;
		}
	}

	return plainToInstance(getWhereDtoType(sourceType, options), value);
}

/** @internal */
function generateWhereType(source: DtoType, target: Type<unknown>) {
	for (const key of dtoStorage.getPropertyKeys(source)) {
		const type = new Singleton(() =>
			dtoStorage.getPropertyType(source.prototype as Type<unknown>, key)
		);
		const options = dtoStorage.getPropertyOptions(source.prototype as Type<unknown>, key);

		Reflect.decorate(
			[
				Expose(),
				IsOptional(),
				Transform(({ key, obj }) =>
					transformWhereDto(type, (obj as Record<string, unknown>)[key], options)
				),
				NotEquals(UNKNOWN_DISCRIMINATED_TYPE, {
					message: "The discriminated type was not determined"
				}),
				ValidateNested()
			],
			target.prototype as object,
			key
		);
	}

	return target;
}

/**
 * Generates a [EntityFilter]{@link EntityFilter}
 * class with transformations and validations.
 *
 * @param dto The class used to determine the transformation and validations
 * @returns The generated class
 */
export function FindQueryWhereDtoOf<T extends object>(dto: Type<T>): Type<EntityFilter<T>> {
	class WhereDto implements EntityFilterLogicalOperators<T> {
		@Expose()
		@IsArray()
		@IsOptional()
		@TypeTransformer(() => WhereDto)
		@ValidateNested({ each: true })
		public $and?;

		@Expose()
		@IsOptional()
		@TypeTransformer(() => WhereDto)
		@ValidateNested()
		public $not?;

		@Expose()
		@IsArray()
		@IsOptional()
		@TypeTransformer(() => WhereDto)
		@ValidateNested({ each: true })
		public $or?;
	}

	Object.defineProperty(WhereDto, "name", { value: `${WhereDto.name}${dto.name}` });
	return generateWhereType(dto, WhereDto) as never;
}
