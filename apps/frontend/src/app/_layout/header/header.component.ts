import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map } from "rxjs";
import { UserDto } from "~/lib/common/app/user/dtos";

import { AuthModule } from "../../auth/auth.module";
import { AuthService } from "../../auth/auth.service";
import { UserModule } from "../../user/user.module";

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
		MatDialogModule,
		MatIconModule,
		MatMenuModule,
		MatListModule,
		RouterModule,
		TranslateModule,
		UserModule
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
	 * @param matDialog injected
	 */
	public constructor(
		protected readonly authService: AuthService,
		protected readonly router: Router,
		protected readonly matDialog: MatDialog
	) {}

	/**
	 * Handles the logout action
	 *
	 * @returns Promise
	 */
	protected handleLogout() {
		return this.authService.logout().then(() => this.router.navigateByUrl("/auth/login"));
	}

	/**
	 * Opens the profile dialog for the logged user
	 *
	 * @param user the connected user
	 */
	protected async openProfile(user: UserDto) {
		const { ProfileDialog } = await import("../../auth/dialogs/profile/profile.dialog");

		ProfileDialog.open(this.matDialog, { user });
	}
}
