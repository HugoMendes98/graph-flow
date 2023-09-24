import { CommonModule } from "@angular/common";
import { Component, ContentChild, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { OrderValue } from "~/lib/common/endpoints";

import { ListSortColumns, ListSortOrderValueDefault } from "../../list-sort.columns";
import { ListSortIconComponent } from "../list-sort-icon/list-sort-icon.component";

@Component({
	selector: "ui-list-table-header",
	standalone: true,
	styleUrls: ["./list-table-header.component.scss"],
	templateUrl: "./list-table-header.component.html",

	imports: [CommonModule, ListSortIconComponent]
})
export class ListTableHeaderComponent<COLUMN extends number | string, ORDER extends OrderValue> {
	/**
	 * Creates a {@link ListSortColumns}'s update
	 *
	 * @param ascFirst to set `ASC` before `DESC
	 * @returns Function to pass to a {@link ListSortColumns}'s update
	 */
	public static DEFAULT_NEXT_DIRECTION(ascFirst?: boolean) {
		const order: ListSortOrderValueDefault[] = ["desc", "asc"];
		const [first, second] = ascFirst ? order.slice().reverse() : order;

		return (
			direction: ListSortOrderValueDefault | false
		): ListSortOrderValueDefault | false => {
			if (!direction) {
				return first;
			}

			return direction === first ? second : false;
		};
	}

	/**
	 * The content of the header
	 */
	@ContentChild("*")
	public readonly contentChild?: ElementRef;

	/**
	 * The column this header represents
	 */
	@Input({ required: true })
	public column!: COLUMN;

	/**
	 * The current applied sort to all columns
	 */
	@Input()
	public sortColumns?: ListSortColumns<COLUMN, ORDER>;

	/**
	 * Define the next sort direction
	 */
	@Input()
	public updateDirection?: (current: ORDER | false) => ORDER | false;

	/**
	 * Emits when there is a sort change
	 */
	@Output()
	public readonly sort = new EventEmitter<ListSortColumns<COLUMN, ORDER>>();

	/**
	 * Handle click on the table header
	 */
	protected handleClick() {
		if (!this.updateDirection) {
			return;
		}

		const lsc = this.sortColumns ?? new ListSortColumns();
		const updated = lsc.updateColumn(this.column, this.updateDirection);

		if (updated !== lsc) {
			// Only notify on change
			this.sort.next(updated);
		}
	}
}
