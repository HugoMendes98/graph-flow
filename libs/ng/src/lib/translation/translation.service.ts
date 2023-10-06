import { Injectable } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

/**
 * A service for application translation (e.g.: form-control errors)
 */
@Injectable({ providedIn: "root" })
export class TranslationService {
	// TODO: use this to translate api data

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param translate injected
	 */
	public constructor(private readonly translate: TranslateService) {}

	/**
	 * Translates messages from error control
	 *
	 * @param errors the errors received
	 * @returns the error message for an abstract control errors, empty string if no error
	 */
	public translateControlError(errors: ValidationErrors | null): Observable<string> {
		if (errors === null) {
			return of("");
		}
		if (errors["required"] !== undefined) {
			return this.translate.stream("errors.validation.required") as Observable<string>;
		}
		if (errors["email"] !== undefined) {
			return this.translate.stream("errors.validation.email") as Observable<string>;
		}
		if (errors["minlength"] !== undefined) {
			return this.translate.stream(
				"errors.validation.minlength",
				errors["minlength"] as never
			) as Observable<string>;
		}

		return this.translate.stream("errors.validation.invalid") as Observable<string>;
	}
}
