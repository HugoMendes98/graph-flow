import { Expose } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

/**
 * Base class for primitive validation
 */
export class WhereBaseDto {
	/**
	 * Search for records whose value exists (!= null).
	 *
	 * It can also be tested with `$eq = null` or `$ne = null`.
	 */
	@Expose()
	@IsBoolean()
	@IsOptional()
	public $exists?: boolean;
}
