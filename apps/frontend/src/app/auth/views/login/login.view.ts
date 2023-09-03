import { Component, Input } from "@angular/core";
import { ApiModule } from "~/lib/ng/lib/api";
import { AuthApiService } from "~/lib/ng/lib/api/auth-api";

import { LoginCardComponent } from "../../components/login-card/login-card.component";

@Component({
	standalone: true,
	styleUrls: ["./login.view.scss"],
	templateUrl: "./login.view.html",

	imports: [ApiModule, LoginCardComponent]
})
export class LoginView {
	/**
	 * The URL to redirect when the user logs
	 */
	@Input()
	public redirectUrl?: string;

	public constructor(private readonly service: AuthApiService) {}
}
