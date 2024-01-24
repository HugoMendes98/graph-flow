import { Expose, Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

import { WhereBaseDto } from "./where-base.dto";
import { EntityFilterValue } from "../../../endpoints";
import { CanBeNull } from "../../../utils/validations";

/**
 * Validation class for nullable `string` properties.
 */
export class WhereStringNullableDto
	extends WhereBaseDto
	implements EntityFilterValue<string>
{
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsOptional()
	@IsString()
	public $eq?: string | null;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsOptional()
	@IsString()
	public $ne?: string | null;

	/**
	 * Search for records whose value is greater than the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $gt?: string;
	/**
	 * Search for records whose value is greater than or equal to the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $gte?: string;

	/**
	 * Search for records whose value is less than the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $lt?: string;
	/**
	 * Search for records whose value is less than or equal to the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $lte?: string;

	/**
	 * Search for records whose value is included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	@Type(() => String)
	public $in?: string[];

	/**
	 * Search for records whose value is **not** included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	@Type(() => String)
	public $nin?: string[];

	/**
	 * Search for records whose value match the given regex string.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $re?: string;

	/**
	 * Search for records whose value looks like the given one (~SQL Like operator).
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public $like?: string;

	/**
	 * Search for records whose value match the given text.
	 *
	 * It works correctly only to indexed properties.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public fulltext?: string;
}

/**
 * Validation class for `string` properties.
 */
export class WhereStringDto extends WhereStringNullableDto {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public declare $eq?: string;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	public declare $ne?: string;
}
