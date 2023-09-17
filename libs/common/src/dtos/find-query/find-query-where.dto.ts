import { Singleton } from "@heap-code/singleton";
import type { Type } from "@nestjs/common";
import { Expose, plainToInstance, Transform, Type as TypeTransformer } from "class-transformer";
import { IsArray, isDateString, isObject, IsOptional, ValidateNested } from "class-validator";

import {
	WhereDateDto,
	WhereDateNullableDto,
	WhereNumberDto,
	WhereNumberNullableDto,
	WhereStringDto,
	WhereStringNullableDto
} from "./where";
import { EntityFilter, EntityFilterLogicalOperators } from "../../endpoints";
import { dtoStorage } from "../dto";

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

	const generateClass = (source: Type<unknown>, target: Type<unknown>) => {
		const keys = dtoStorage.getPropertyKeys(source);

		for (const key of keys) {
			const decorators: PropertyDecorator[] = [Expose(), IsOptional()];

			if (dtoStorage.getPropertyOptions(source.prototype as Type<unknown>, key)?.forwardRef) {
				const singleton = new Singleton(() =>
					generateClass(
						dtoStorage.getPropertyType(source.prototype as Type<unknown>, key),
						// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- class constructed in the function
						class NestedWhereDto {}
					)
				);

				decorators.push(
					TypeTransformer(() => singleton.get()),
					ValidateNested()
				);
			} else {
				const type = dtoStorage.getPropertyType(source.prototype as Type<unknown>, key);
				const { nullable } =
					dtoStorage.getPropertyOptions(source.prototype as Type<unknown>, key) ?? {};

				if ([Date, Number, String].includes(type as never)) {
					decorators.push(IsOptional(), ValidateNested());

					switch (type) {
						case Date: {
							const classType = nullable ? WhereDateNullableDto : WhereDateDto;
							decorators.push(
								Transform(({ key, obj, value }) => {
									if (isObject(value)) {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Given object is an object (already transformed, but empty)
										return plainToInstance(classType, obj[key]);
									}

									if (value === undefined) {
										return undefined;
									}

									return plainToInstance(classType, {
										$eq: isDateString(value)
											? new Date(value as string)
											: (value as never)
									} satisfies WhereDateDto);
								})
							);
							break;
						}
						case Number: {
							const classType = nullable ? WhereNumberNullableDto : WhereNumberDto;
							decorators.push(
								Transform(({ key, obj, value }) => {
									if (isObject(value)) {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Given object is an object (already transformed, but empty)
										return plainToInstance(classType, obj[key]);
									}

									if (value === undefined) {
										return undefined;
									}

									return plainToInstance(classType, {
										$eq: value === null ? null : +value
									} satisfies WhereNumberNullableDto);
								})
							);
							break;
						}
						case String: {
							const classType = nullable ? WhereStringNullableDto : WhereStringDto;
							decorators.push(
								Transform(({ key, obj, value }) => {
									if (isObject(value)) {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Given object is an object (already transformed, but empty)
										return plainToInstance(classType, obj[key]);
									}

									if (value === undefined) {
										return undefined;
									}

									return plainToInstance(classType, {
										$eq: value as string
									} satisfies WhereStringDto);
								})
							);
							break;
						}
					}
				} else {
					// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- class constructed in the function
					const nestedType = generateClass(type, class NestedWhereDto {});
					decorators.push(
						TypeTransformer(() => nestedType),
						ValidateNested()
					);
				}
			}

			Reflect.decorate(decorators, target.prototype as object, key);
		}

		return target;
	};

	return generateClass(dto, WhereDto) as never;
}
