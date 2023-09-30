import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { WhereBaseDto } from "./where-base.dto";
import { EntityFilterValue } from "../../../endpoints";
import { CanBeNull } from "../../../utils/validations";

/**
 * Transform to a boolean value, also from string
 *
 * @param nullable can it be null
 * @returns the transform decorator
 */
const TransformBoolean = (nullable: boolean) =>
	Transform(({ value }) => {
		switch (value) {
			case "true":
			case true:
				return true;
			case "false":
			case false:
				return false;
			case undefined:
				return undefined;
			case "null":
			case null:
				if (nullable) {
					return null;
				}
		}

		return "invalid";
	});

/**
 * Validation class for nullable `boolean` properties.
 */
export class WhereBooleanNullableDto extends WhereBaseDto implements EntityFilterValue<boolean> {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsBoolean()
	@IsOptional()
	@TransformBoolean(true)
	public $eq?: boolean | null;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@CanBeNull()
	@Expose()
	@IsBoolean()
	@IsOptional()
	@TransformBoolean(true)
	public $ne?: boolean | null;
}

/**
 * Validation class for `boolean` properties.
 */
export class WhereBooleanDto extends WhereBooleanNullableDto {
	/**
	 * Search for records whose value is equal to the given one.
	 */
	@Expose()
	@IsBoolean()
	@IsOptional()
	@TransformBoolean(false)
	public declare $eq?: boolean;
	/**
	 * Search for records whose value is **not** equal to the given one.
	 */
	@Expose()
	@IsBoolean()
	@IsOptional()
	@TransformBoolean(false)
	public declare $ne?: boolean;
}
