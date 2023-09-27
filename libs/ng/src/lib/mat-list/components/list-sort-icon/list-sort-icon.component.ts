import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatIconModule } from "@angular/material/icon";
import { isOrderValueDesc, OrderValue } from "~/lib/common/endpoints";

@Component({
	selector: "ui-list-sort-icon",
	standalone: true,
	styleUrls: ["./list-sort-icon.component.scss"],
	templateUrl: "./list-sort-icon.component.html",

	imports: [CommonModule, MatIconModule, MatBadgeModule]
})
export class ListSortIconComponent {
	/**
	 * Value to show as a badge on the arrow
	 */
	@Input()
	public order?: number;

	/** @internal */
	protected isDesc = true;

	/**
	 * Direction of the arrow
	 */
	@Input({ required: true })
	public set direction(direction: OrderValue) {
		this.isDesc = isOrderValueDesc(direction);
	}
}
