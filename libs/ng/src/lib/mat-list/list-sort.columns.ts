import { OrderValue } from "~/lib/common/endpoints";

/**
 * A single column
 */
export interface ListSortColumn<T extends number | string, U extends OrderValue = OrderValue> {
	/**
	 * The column identifier
	 */
	readonly column: T;
	/**
	 * The direction of the column
	 */
	readonly direction: U;
}

/** Default (basic) possible orders */
export type ListSortOrderValueDefault = Extract<OrderValue, "asc" | "desc">;

/**
 * A list of sortable columns
 *
 * Everything is readonly
 */
export class ListSortColumns<
	T extends number | string,
	U extends OrderValue = ListSortOrderValueDefault
> {
	/**
	 * Creates a list of sortable columns
	 *
	 * @param columns the initial columns
	 */
	public constructor(public readonly columns: ReadonlyArray<ListSortColumn<T, U>> = []) {}

	/**
	 * Finds an item from the columns
	 *
	 * @param column the column to look for
	 * @returns the item found with its position
	 */
	public findIndexByColumn(column: T) {
		const position = this.columns.findIndex(lsc => lsc.column === column);
		if (position < 0) {
			return undefined;
		}

		return { item: this.columns[position], position };
	}

	/**
	 * Updates a column
	 *
	 * @param column to update
	 * @param update value to set, given the current one. `false` to remove
	 * @returns A new object with updated columns or itself if nothing changes
	 */
	public updateColumn(column: T, update: (current: U | false) => U | false) {
		const element = this.findIndexByColumn(column);
		const direction = update(element?.item.direction ?? false);

		if (!element) {
			return direction === false
				? this
				: new ListSortColumns([...this.columns, { column, direction }]);
		}

		const { item, position } = element;
		const before = this.columns.slice(0, position);
		const after = this.columns.slice(position + 1);

		return new ListSortColumns(
			direction === false
				? [...before, ...after]
				: [...before, { ...item, direction }, ...after]
		);
	}
}
