import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

import { EntityFilterValue } from "../../../../endpoints/_lib";
import { CanBeNull } from "../../../../utils/validations";

/**
 * Validation class for nullable `string` properties.
 */
export class WhereStringNullableDto implements EntityFilterValue<string> {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@CanBeNull()
	@IsString()
	@IsOptional()
	public $eq?: string | null;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@CanBeNull()
	@IsString()
	@IsOptional()
	public $ne?: string | null;

	/**
	 * Search for records whose value exists (!= null).
	 *
	 * It can also be tested with `$eq = null` or `$ne = null`.
	 */
	@IsBoolean()
	@IsOptional()
	public $exists?: boolean;

	/**
	 * Search for records whose value is greater than the given one.
	 */
	@IsString()
	@IsOptional()
	public $gt?: string;
	/**
	 * Search for records whose value is greater than or equal to the given one.
	 */
	@IsString()
	@IsOptional()
	public $gte?: string;

	/**
	 * Search for records whose value is less than the given one.
	 */
	@IsString()
	@IsOptional()
	public $lt?: string;
	/**
	 * Search for records whose value is less than or equal to the given one.
	 */
	@IsString()
	@IsOptional()
	public $lte?: string;

	/**
	 * Search for records whose value is included in the given list.
	 */
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@Type(() => String)
	public $in?: string[];

	/**
	 * Search for records whose value is **not** included in the given list.
	 */
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@Type(() => String)
	public $nin?: string[];

	/**
	 * Search for records whose value match the given regex string.
	 */
	@IsString()
	@IsOptional()
	public $re?: string;

	/**
	 * Search for records whose value looks like the given one (~SQL Like operator).
	 */
	@IsString()
	@IsOptional()
	public $like?: string;

	/**
	 * Search for records whose value match the given text.
	 *
	 * It works correctly only to indexed properties.
	 */
	@IsString()
	@IsOptional()
	public fulltext?: string;
}

/**
 * Validation class for `string` properties.
 */
export class WhereStringDto extends WhereStringNullableDto {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@IsString()
	@IsOptional()
	public declare $eq?: string;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@IsString()
	@IsOptional()
	public declare $ne?: string;
}
