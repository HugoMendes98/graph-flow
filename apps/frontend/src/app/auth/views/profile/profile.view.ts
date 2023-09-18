import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { AuthModule } from "../../auth.module";
import { AuthService } from "../../auth.service";

@Component({
	standalone: true,
	styleUrls: ["./profile.view.scss"],
	templateUrl: "./profile.view.html",

	imports: [AuthModule, CommonModule]
})
export class ProfileView {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: AuthService) {}
}
