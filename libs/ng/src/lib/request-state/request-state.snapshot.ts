import { pick } from "~/lib/common/utils/object-fns";

import { RequestState } from "./request-state";

/**
 * A "snapshot" of a {@link RequestState} with its possible content
 */
export interface RequestStateSnapshot<T, E> {
	/**
	 * The data (or empty) of the current {@link RequestState}
	 */
	data?: T;
	/**
	 * The error (or empty) of the current {@link RequestState}
	 */
	error?: E;
	/**
	 * Is current {@link RequestState} in a loading state?
	 */
	isLoading: boolean;
}

/**
 * A {@link RequestState} with its {@link RequestStateSnapshot}
 */
export type RequestStateWithSnapshot<T, E> = RequestState<T, E> & {
	// TODO: better name than snapshot
	/**
	 * The "snapshot" of the {@link RequestState}
	 */
	snapshot: RequestStateSnapshot<T, E>;
};

/**
 * Gets a snapshot from a given {@link RequestState}
 *
 * @param state to get the snapshot from
 * @returns RequestStateSnapshot the snapshot of the given state
 */
export function getRequestStateSnapshot<T, E>(
	state: RequestState<T, E>
): RequestStateSnapshot<T, E> {
	switch (state.state) {
		case "init":
			return { isLoading: false };
		case "loading": {
			const snapshot: RequestStateSnapshot<T, E> = {
				...pick(state, ["data"]),
				isLoading: true
			};
			return state.error === false
				? snapshot
				: { ...snapshot, error: state.error };
		}
		case "success":
			return { data: state.data, isLoading: false };
		case "failed": {
			return { ...pick(state, ["data", "error"]), isLoading: false };
		}
	}
}
