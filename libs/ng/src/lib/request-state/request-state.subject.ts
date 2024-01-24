import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

import { RequestState } from "./request-state";
import {
	getRequestStateSnapshot,
	RequestStateWithSnapshot
} from "./request-state.snapshot";

/**
 * An observable of the state of any async request.
 *
 * It splits the error into a field to be more easily used in template
 */
export class RequestStateSubject<
		T,
		E = HttpErrorResponse,
		ARGS extends readonly unknown[] = never
	>
	extends Observable<RequestStateWithSnapshot<T, E>>
	implements
		Pick<BehaviorSubject<RequestStateWithSnapshot<T, E>>, "getValue">
{
	private readonly subject = new BehaviorSubject<
		RequestStateWithSnapshot<T, E>
	>(
		this.getRequestWithSnapshot({
			state: "init"
		})
	);

	/**
	 * Create a {@link RequestStateSubject}
	 *
	 * @param fn The async "request" to run
	 */
	public constructor(private readonly fn: (...args: ARGS) => Promise<T> | T) {
		super();

		this.source = this.subject;
	}

	/**
	 * Run the given function.
	 * The state is updated during the request
	 *
	 * @param args The arguments defined to make a request
	 * @returns The final results of the request
	 */
	public async request(...args: ARGS) {
		const previous = this.getValue();
		this.next({
			...(previous.state === "init" ? { error: false } : previous),
			state: "loading"
		});

		try {
			const result = await this.fn(...args);
			this.next({ data: result, error: false, state: "success" });
			return result;
		} catch (exception: unknown) {
			this.next({ ...previous, error: exception as E, state: "failed" });
			throw exception;
		}
	}

	/** @inheritDoc */
	public getValue() {
		return this.subject.getValue();
	}

	private getRequestWithSnapshot(
		state: RequestState<T, E>
	): RequestStateWithSnapshot<T, E> {
		return { ...state, snapshot: getRequestStateSnapshot(state) };
	}
	private next(state: RequestState<T, E>) {
		this.subject.next(this.getRequestWithSnapshot(state));
	}
}
