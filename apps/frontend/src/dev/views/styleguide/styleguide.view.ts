import { Component } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";

import { StyleguideButtonsComponent } from "../../components/styleguide/styleguide-buttons/styleguide-buttons.component";

@Component({
	standalone: true,
	styleUrls: ["./styleguide.view.scss"],
	templateUrl: "./styleguide.view.html",

	imports: [MatExpansionModule, StyleguideButtonsComponent]
})
export class StyleguideView {}
