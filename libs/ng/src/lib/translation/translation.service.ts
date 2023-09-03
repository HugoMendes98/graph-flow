import { Injectable } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class TranslationService {
	// TODO: use this to translate api data

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

		type T = Record<
			keyof Pick<TranslateService, "stream">,
			(...params: Parameters<typeof this.translate.stream>) => Observable<string>
		>;

		if (errors["required"] !== undefined) {
			return (this.translate as T).stream("errors.validation.required");
		}
		if (errors["email"] !== undefined) {
			return (this.translate as T).stream("errors.validation.email");
		}
		if (errors["minlength"] !== undefined) {
			return (this.translate as T).stream(
				"errors.validation.minlength",
				errors["minlength"] as never
			);
		}

		return (this.translate as T).stream("errors.validation.invalid");
	}
}
