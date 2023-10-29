import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

/**
 * Nothing more than a simple box with a progress spinner inside
 */
@Component({
	selector: "ui-loading-box",
	standalone: true,
	styleUrls: ["./loading-box.component.scss"],
	templateUrl: "./loading-box.component.html",

	imports: [CommonModule, MatProgressSpinnerModule]
})
export class LoadingBoxComponent {
	/**
	 * Background CSS color of the box
	 */
	@HostBinding("style.--back-color")
	@Input()
	public backgroundColor? = "var(--mat-stepper-line-color)";

	/** Color to use for the spinner */
	@Input()
	public color?: ThemePalette = "accent";
	/** Diameter for the spinner */
	@Input()
	public diameter = 96;

	/**
	 * Apply some classes directly to the host
	 */
	@HostBinding("class")
	private readonly class = "border-radius-4 p-4";
}
