import type { Type } from "@nestjs/common";
import { Type as TypeTransformer } from "class-transformer";
import { IsArray, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";

import { FindQueryOrderDtoOf } from "./find-query/find-query-order.dto";
import { FindQueryWhereDtoOf } from "./find-query/find-query-where.dto";
import { EntityFindQuery, EntityFilter, EntityOrder } from "../../endpoints/_lib";

/**
 * Base class for the query parameters when making requests
 */
export abstract class FindQueryDto<T> implements EntityFindQuery<T> {
	/**
	 * @inheritDoc
	 */
	public abstract order?: Array<EntityOrder<T>>;
	/**
	 * @inheritDoc
	 */
	public abstract where?: EntityFilter<T>;

	/**
	 * Limit the number of items returned<br /> · Use `0` to count only
	 */
	@IsNumber()
	@IsOptional()
	@Min(0)
	public limit?: number = 50;

	/**
	 * Skip some items
	 */
	@IsNumber()
	@IsOptional()
	@Min(0)
	public skip?: number;
}

/**
 * Generates a [FindQueryDto]{@link FindQueryDto}
 * class with transformations and validations.
 *
 * @param dto The class used to determine the transformation and validations
 * @returns The generated class
 */
export function FindQueryDtoOf<T extends object>(dto: Type<T>): Type<EntityFindQuery<T>> {
	const OrderDto = FindQueryOrderDtoOf(dto);
	const WhereDto = FindQueryWhereDtoOf(dto);

	class FindDto extends FindQueryDto<T> {
		@IsArray()
		@IsOptional()
		@ValidateNested({ each: true })
		@TypeTransformer(() => OrderDto)
		public override order?;

		@ValidateNested()
		@TypeTransformer(() => WhereDto)
		public override where?;
	}

	return FindDto;
}
