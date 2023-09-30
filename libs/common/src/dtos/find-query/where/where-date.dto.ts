import { Expose, Type } from "class-transformer";
import { IsArray, IsDate, IsOptional } from "class-validator";

import { WhereBaseDto } from "./where-base.dto";
import { EntityFilterValue } from "../../../endpoints";
import { CanBeNull } from "../../../utils/validations";

/**
 * Validation class for nullable `Date` properties.
 */
export class WhereDateNullableDto extends WhereBaseDto implements EntityFilterValue<Date> {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsDate()
	@IsOptional()
	public $eq?: Date | null;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsDate()
	@IsOptional()
	public $ne?: Date | null;

	/**
	 * Search for records whose value is greater than the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public $gt?: Date;
	/**
	 * Search for records whose value is greater than or equal to the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public $gte?: Date;

	/**
	 * Search for records whose value is less than the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public $lt?: Date;
	/**
	 * Search for records whose value is less than or equal to the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public $lte?: Date;

	/**
	 * Search for records whose value is included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsDate({ each: true })
	@IsOptional()
	@Type(() => Date)
	public $in?: Date[];

	/**
	 * Search for records whose value is **not** included in the given list.
	 */
	@Expose()
	@IsArray()
	@IsDate({ each: true })
	@IsOptional()
	@Type(() => Date)
	public $nin?: Date[];
}

/**
 * Validation class for `Date` properties.
 */
export class WhereDateDto extends WhereDateNullableDto {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public declare $eq?: Date;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@Expose()
	@IsDate()
	@IsOptional()
	public declare $ne?: Date;
}
