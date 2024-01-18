import { RequestState } from "./request-state";
import {
	getRequestStateSnapshot,
	RequestStateSnapshot
} from "./request-state.snapshot";

describe("RequestStateSnapshot", () => {
	describe("getRequestStateSnapshot", () => {
		type Data = string;
		type Error = number;
		type State = RequestState<Data, Error>;
		type Snapshot = RequestStateSnapshot<Data, Error>;

		const stateInit = { state: "init" } as const satisfies State;

		const stateLoading = {
			error: false,
			state: "loading"
		} as const satisfies State;
		const stateLoadingWithData = {
			data: "ok",
			error: false,
			state: "loading"
		} as const satisfies State;
		const stateLoadingWithError = {
			error: 1,
			state: "loading"
		} as const satisfies State;
		const stateLoadingWithDataAndError = {
			data: "was ok",
			error: 2,
			state: "loading"
		} as const satisfies State;

		const stateFailed = {
			error: 1,
			state: "failed"
		} as const satisfies State;
		const stateFailedWithData = {
			data: "was ok",
			error: 3,
			state: "failed"
		} as const satisfies State;

		const stateSuccess = {
			data: "ok",
			error: false,
			state: "success"
		} as const satisfies State;

		it("should return the snapshot", () => {
			for (const [state, snapshot] of [
				[stateInit, { isLoading: false }],
				[stateLoading, { isLoading: true }],
				[
					stateLoadingWithData,
					{ data: stateLoadingWithData.data, isLoading: true }
				],
				[
					stateLoadingWithError,
					{ error: stateLoadingWithError.error, isLoading: true }
				],
				[
					stateLoadingWithDataAndError,
					{
						data: stateLoadingWithDataAndError.data,
						error: stateLoadingWithDataAndError.error,
						isLoading: true
					}
				],
				[stateFailed, { error: stateFailed.error, isLoading: false }],
				[
					stateFailedWithData,
					{
						data: stateFailedWithData.data,
						error: stateFailedWithData.error,
						isLoading: false
					}
				],
				[stateSuccess, { data: stateSuccess.data, isLoading: false }]
			] satisfies Array<[State, Snapshot]>) {
				expect(
					getRequestStateSnapshot<Data, Error>(state)
				).toStrictEqual(snapshot);
			}
		});
	});
});
