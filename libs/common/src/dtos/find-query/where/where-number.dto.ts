import { Expose, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

import { WhereBaseDto } from "./where-base.dto";
import { EntityFilterValue } from "../../../endpoints";
import { CanBeNull } from "../../../utils/validations";

/**
 * Validation class for nullable `number` properties.
 */
export class WhereNumberNullableDto extends WhereBaseDto implements EntityFilterValue<number> {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	public $eq?: number | null;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	public $ne?: number | null;

	/**
	 * Search for records whose value is greater than the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public $gt?: number;
	/**
	 * Search for records whose value is greater than or equal to the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public $gte?: number;

	/**
	 * Search for records whose value is less than the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public $lt?: number;
	/**
	 * Search for records whose value is less than or equal to the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public $lte?: number;

	/**
	 * Search for records whose value is included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	@Type(() => Number)
	public $in?: number[];

	/**
	 * Search for records whose value is **not** included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsNumber({}, { each: true })
	@IsOptional()
	@Type(() => Number)
	public $nin?: number[];
}

/**
 * Validation class for `number` properties.
 */
export class WhereNumberDto extends WhereNumberNullableDto {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public declare $eq?: number;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@Expose()
	@IsNumber()
	@IsOptional()
	public declare $ne?: number;
}
