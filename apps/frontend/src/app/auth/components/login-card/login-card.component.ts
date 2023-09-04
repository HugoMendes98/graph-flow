import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TranslateService } from "@ngx-translate/core";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";
import { FormControlsFrom } from "~/lib/ng/lib/forms";
import { TranslationModule } from "~/lib/ng/lib/translation";

export type AuthLogin = Omit<AuthLoginDto, "cookie">;

@Component({
	selector: "app-login-card",
	standalone: true,
	styleUrls: ["./login-card.component.scss"],
	templateUrl: "./login-card.component.html",

	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatProgressBarModule,
		MatIconModule,
		ReactiveFormsModule,
		TranslationModule
	]
})
export class LoginCardComponent {
	/** The error on the request */
	@Input()
	public error?: HttpErrorResponse;

	/**
	 * Activates the loading mode, button is disable and fields are readonly
	 */
	@Input()
	public loading?: boolean;

	/** When the login button is pressed */
	@Output()
	public readonly login = new EventEmitter<AuthLogin>();

	protected readonly form = new FormGroup<FormControlsFrom<AuthLogin>>({
		email: new FormControl("", {
			nonNullable: true,
			validators: [Validators.email, Validators.required]
		}),
		password: new FormControl("", {
			nonNullable: true,
			validators: [Validators.minLength(4), Validators.required]
		})
	});

	/**
	 * Show the password on the input
	 */
	protected showPassword = false;

	public constructor(private readonly translateService: TranslateService) {}

	/**
	 * Translates a HTTP error for this component
	 *
	 * @param error to translate
	 * @returns The message for the given error
	 */
	protected errorMessage(error: HttpErrorResponse) {
		switch (error.status) {
			case 400:
				return this.translateService.stream("errors.http.400");
			case 401:
				return this.translateService.stream("components.login.login-fail");
			case 500:
				return this.translateService.stream("errors.http.500");
		}

		return this.translateService.stream("errors.http.generic");
	}

	/**
	 * Listen to any mouseup on the document.
	 * The release of the `showPassword` pointerdown could be done anywhere
	 */
	@HostListener("document:pointerup", [])
	private mouseUp() {
		if (this.showPassword) {
			this.showPassword = false;
		}
	}
}
