import { Component, Input } from "@angular/core";
import { type GroupDto } from "~/app/common/dtos/group";

@Component({
	selector: "app-group",
	styleUrls: ["./group.component.scss"],
	templateUrl: "./group.component.html"
})
export class GroupComponent {
	/**
	 * Group to show
	 */
	@Input()
	public group!: GroupDto;

	/**
	 * Reverse the view
	 */
	@Input()
	public reverse = false;

	/**
	 * Position of the text
	 */
	@Input()
	public position: "left" | "middle" | "right" = "left";
}
