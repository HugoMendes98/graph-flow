import { Component } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterModule } from "@angular/router";

import { HeaderComponent } from "./_layout/header/header.component";

@Component({
	selector: "app-root",
	standalone: true,
	styleUrls: ["./app.component.scss"],
	templateUrl: "./app.component.html",

	imports: [HeaderComponent, RouterModule, MatSidenavModule]
})
export class AppComponent {}
