import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogConfig,
	MatDialogModule
} from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { UserDto, UserUpdateDto } from "~/lib/common/app/user/dtos";
import { UserApiService } from "~/lib/ng/lib/api/user-api";
import { NullableFormControlsFrom } from "~/lib/ng/lib/forms";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";

import { UserModule } from "../../../user/user.module";
import { AuthService } from "../../auth.service";

export type { AuthLogin } from "../../auth.service";

export interface ProfileDialogData {
	user: UserDto;
}

export type ProfileDialogResult = never;

@Component({
	standalone: true,
	styleUrls: ["./profile.dialog.scss"],
	templateUrl: "./profile.dialog.html",

	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
		ReactiveFormsModule,
		TranslateModule,
		FormsModule,
		UserModule
	]
})
export class ProfileDialog {
	/**
	 * Opens this dialog
	 *
	 * @param matDialog the matDialog service to open dialogs
	 * @param data the mandatory data to pass to the dialog
	 * @param config for the dialog
	 * @returns MatDialogRef
	 */
	public static open(
		matDialog: MatDialog,
		data: ProfileDialogData,
		config?: Omit<MatDialogConfig, "data">
	) {
		return matDialog.open<ProfileDialog, unknown, ProfileDialogResult>(ProfileDialog, {
			data,
			...config
		});
	}

	protected readonly form: FormGroup<
		NullableFormControlsFrom<Pick<UserDto, "firstname" | "lastname">>
	>;

	/**
	 * Handles the update of the form
	 */
	protected readonly requestStateUpdate$ = new RequestStateSubject((dto: UserUpdateDto) =>
		this.userApi
			.update(this.dialogData.user._id, dto)
			.then(() => this.authService.refresh().then(({ user }) => (this.user = user)))
	);

	/**
	 * The user of this profile
	 */
	protected user: UserDto;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param dialogData injected
	 * @param authService injected
	 * @param userApi injected
	 */
	public constructor(
		@Inject(MAT_DIALOG_DATA) private readonly dialogData: ProfileDialogData,
		private readonly authService: AuthService,
		private readonly userApi: UserApiService
	) {
		const { firstname, lastname } = (this.user = this.dialogData.user);

		this.form = new FormGroup({
			firstname: new FormControl(firstname),
			lastname: new FormControl(lastname)
		});
	}
}
