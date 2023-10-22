import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
	selector: "app-node-selector",
	standalone: true,
	styleUrls: ["./node-selector.component.scss"],
	templateUrl: "./node-selector.component.html",

	imports: [CommonModule]
})
export class NodeSelectorComponent {}
