import type { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Range of paginated results
 */
export class FindResultsRange {
	/**
	 * Position of the first result returned from the whole filtered data
	 */
	public readonly start!: number;

	/**
	 * Position of the last result returned from the whole filtered data (not included)
	 *
	 * @example
	 * ```
	 * for (let i = range.start; i < range.end; ++i);
	 * ```
	 */
	public readonly end!: number;
}

/**
 * Pagination of results
 */
export class FindResultsPagination {
	/**
	 * The range of selected results
	 */
	public readonly range!: FindResultsRange;

	/**
	 * Total of items without the limit or the skip
	 */
	public readonly total!: number;
}

/**
 * DTO containing the data and the pagination when listing data
 */
export abstract class FindResultsDto<T> {
	/**
	 * The data of the results
	 */
	public abstract data: T[];

	/**
	 * The pagination of the result
	 */
	public readonly pagination!: FindResultsPagination;
}

// TODO: a type/interface to get the abstract properties
/**
 * Generate a [FindResultsDto]{@link FindResultsDto} class with its ApiProperty Info.
 *
 * It currently does nothing more than adding a [ApiProperty]{@link ApiProperty} decorator.
 *
 * @param dto The class to determine the result type
 * @returns The generated class
 */
export function FindResultsDtoOf<T>(
	dto: Type<T>
): Type<FindResultsDto<T> & { data: T[] }> {
	class ResultsDto extends FindResultsDto<T> {
		@ApiProperty({ isArray: true, type: dto })
		public declare data: T[];
	}

	return ResultsDto;
}
