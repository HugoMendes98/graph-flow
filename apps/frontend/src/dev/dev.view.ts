import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	standalone: true,
	styleUrls: ["./dev.view.scss"],
	templateUrl: "./dev.view.html",

	imports: [CommonModule, RouterModule]
})
export class DevView {}
