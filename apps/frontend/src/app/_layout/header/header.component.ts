import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map } from "rxjs";

import { AuthModule } from "../../auth/auth.module";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-header",
	standalone: true,
	styleUrls: ["./header.component.scss"],
	templateUrl: "./header.component.html",

	imports: [
		AuthModule,
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
		MatListModule,
		RouterModule,
		TranslateModule
	]
})
export class HeaderComponent {
	protected readonly user$ = this.authService.userState$.pipe(
		map(state => (state.type === "connected" ? state.user : null))
	);

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param authService injected
	 * @param router injected
	 */
	public constructor(
		protected readonly authService: AuthService,
		protected readonly router: Router
	) {}

	/**
	 * Handles the logout action
	 *
	 * @returns Promise
	 */
	protected handleLogout() {
		return this.authService.logout().then(() => this.router.navigateByUrl("/auth/login"));
	}
}
