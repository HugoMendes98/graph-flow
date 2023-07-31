import { Component } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
	selector: "app-header",
	standalone: true,
	styleUrls: ["./header.component.scss"],
	templateUrl: "./header.component.html",

	imports: [MatToolbarModule]
})
export class HeaderComponent {}
