import { OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { Subscription } from "rxjs";

import { TranslationService } from "../translation.service";

@Pipe({ name: "translateHttpError", pure: true })
export class TranslationHttpErrorPipe implements PipeTransform, OnDestroy {
	private value = "";
	private subscription?: Subscription;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: TranslationService) {}

	/** @inheritDoc */
	public ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	/** @inheritDoc */
	public transform(status: number) {
		// Resets on change
		this.ngOnDestroy();

		this.subscription = this.service
			.translateHttpError(status)
			.subscribe(value => (this.value = value));

		return this.value;
	}
}
