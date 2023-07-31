import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

// This is exactly the same as the one given at https://material.angular.io/components/button/examples.
// The only modification allowed is for the formatting

@Component({
	selector: "app-dev-styleguide-buttons",
	standalone: true,
	styleUrls: ["./styleguide-buttons.component.scss"],
	templateUrl: "./styleguide-buttons.component.html",

	imports: [MatButtonModule, MatIconModule]
})
export class StyleguideButtonsComponent {}
