import { HttpErrorResponse } from "@angular/common/http";

export interface RequestLoading<T, E> {
	/**
	 * The possible data before the loading started
	 */
	data?: T;
	/**
	 * The error, or none, when the loading started
	 *
	 * @default false
	 */
	error: E | false;
}

export interface RequestSucceed<T> {
	/**
	 * The data from the request
	 */
	data: T;
	/**
	 * No error
	 */
	error: false;
}

export interface RequestFailed<T, E> {
	/**
	 * The possible data before the fail
	 */
	data?: T;
	/**
	 * The error of the state
	 */
	error: E;
}

/**
 * A state for async requests (not necessarily HTTP)
 */
export type RequestState<T, E = HttpErrorResponse> =
	| { state: "init" }
	| (RequestFailed<T, E> & { state: "failed" })
	| (RequestLoading<T, E> & { state: "loading" })
	| (RequestSucceed<T> & { state: "success" });

/**
 * The possible type for the state of a {@link RequestState}
 */
export type RequestStateState = RequestState<never>["state"];
