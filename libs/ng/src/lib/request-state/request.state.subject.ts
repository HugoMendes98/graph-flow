import { BehaviorSubject, Observable } from "rxjs";

import { RequestState } from "./request.state";

/**
 * An observable of the state of any async request.
 *
 * It splits the error into a field to be more easily used in template
 */
export class RequestStateSubject<T, E, ARGS extends readonly unknown[]>
	extends Observable<RequestState<T, E>>
	implements Pick<BehaviorSubject<RequestState<T, E>>, "getValue">
{
	private readonly subject = new BehaviorSubject<RequestState<T, E>>({ state: "init" });

	/**
	 * Create a {@link RequestStateSubject}
	 *
	 * @param fn The async "request" to run
	 */
	public constructor(private readonly fn: (...args: ARGS) => Promise<T> | T) {
		super();

		// eslint-disable-next-line etc/no-deprecated -- FIXME: implement correctly
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
		this.subject.next({
			...(previous.state === "init" ? { error: false } : previous),
			state: "loading"
		});

		try {
			const result = await this.fn(...args);
			this.subject.next({ data: result, error: false, state: "success" });
			return result;
		} catch (exception: unknown) {
			this.subject.next({ ...previous, error: exception as E, state: "failed" });
			throw exception;
		}
	}

	/**
	 * @inheritDoc
	 */
	public getValue(): RequestState<T, E> {
		return this.subject.getValue();
	}
}
