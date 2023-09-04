import { OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { Subscription } from "rxjs";

import { TranslationService } from "../translation.service";

@Pipe({ name: "translateControlError", pure: true })
export class TranslationControlErrorPipe implements PipeTransform, OnDestroy {
	private value = "";
	private subscription?: Subscription;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: TranslationService) {}

	/**
	 * @inheritDoc
	 */
	public ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	/**
	 * @inheritDoc
	 */
	public transform(errors: ValidationErrors | null) {
		// Resets on change
		this.ngOnDestroy();

		this.subscription = this.service
			.translateControlError(errors)
			.subscribe(value => (this.value = value));

		return this.value;
	}
}
