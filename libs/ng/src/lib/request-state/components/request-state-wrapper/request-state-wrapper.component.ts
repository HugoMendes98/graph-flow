import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, ContentChild, ElementRef, Input } from "@angular/core";
import { MatCardActions } from "@angular/material/card";

import { LoadingBoxComponent } from "../../../components/loading-box/loading-box.component";
import { HttpErrorCard } from "../../cards/net-error/http-error.card";
import { RequestState } from "../../request-state";

/**
 * A component that, given a request state, will:
 * - show a loading box (on loading or init)
 * - an error card
 * - nothing on success
 */
@Component({
	selector: "ui-request-state-wrapper",
	standalone: true,
	styleUrls: ["./request-state-wrapper.component.scss"],
	templateUrl: "./request-state-wrapper.component.html",

	imports: [CommonModule, HttpErrorCard, LoadingBoxComponent]
})
export class RequestStateWrapperComponent<
	E extends HttpErrorResponse = HttpErrorResponse,
	T = never
> {
	/** Addition classes for the loading element */
	@Input()
	public classLoading = "";
	/** Addition classes for the error card element */
	@Input()
	public classErrorCard = "";

	/**
	 * Add some actions at the bottom of the http error card.
	 * They are ignored when loading on a keepError
	 *
	 * @see HttpErrorCard
	 */
	@ContentChild(MatCardActions, { descendants: true })
	public errorActions?: ElementRef;

	/**
	 * Consider the init state as loading?
	 */
	@Input()
	public initAsLoading? = true;

	/**
	 * Keep the error card when the state is loading with a previous error?
	 */
	@Input()
	public keepError? = true;

	/**
	 * The state to wrap
	 */
	@Input({ required: true })
	public requestState!: RequestState<T, E>;

	/**
	 * Is the state being loaded
	 *
	 * @returns Is the state is in loading state
	 */
	protected get isLoading(): boolean | undefined {
		const { state } = this.requestState;
		return state === "loading" || (this.initAsLoading && state === "init");
	}

	/**
	 * Should the error card be shown
	 *
	 * @returns the error or false
	 */
	protected get showError(): E | false {
		const state = this.requestState;

		if (state.state === "failed") {
			return state.error;
		}

		if (this.keepError && state.state === "loading" && state.error) {
			return state.error;
		}

		return false;
	}
}
