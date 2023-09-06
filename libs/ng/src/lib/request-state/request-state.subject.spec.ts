import { ProducerConsumer } from "@heap-code/concurrency-synchronization";

import {
	RequestFailed,
	RequestLoading,
	RequestState,
	RequestStateState,
	RequestSucceed
} from "./request-state";
import { RequestStateSubject } from "./request-state.subject";

describe("RequestStateSubject", () => {
	// Constant timeout for all tests
	const timeout = 100;
	const timeoutMax = 150;

	const createRSS = () =>
		new RequestStateSubject<number, number, [number, number]>(
			// Resolve when positive, fail when negative
			(time: number, value: number) =>
				new Promise((resolve, reject) =>
					setTimeout(() => {
						if (value < 0) {
							reject(value);
						} else {
							resolve(value);
						}
					}, time)
				)
		);

	it("should be ok on successes (via observable)", () => {
		const requestState$ = createRSS();

		const sem = new ProducerConsumer<RequestState<number, number>>();
		const subscription = requestState$.subscribe(value => sem.write(value));

		// Everything done here to avoid leaks
		return sem
			.tryReadOne(timeout)
			.then(async stateInit => {
				expect(stateInit.state).toBe("init" satisfies RequestStateState);

				const value1 = 200;
				void requestState$.request(timeout, value1);

				const [stateLoading1, stateSuccess1] = await sem.tryRead(timeoutMax, 2);
				expect(stateLoading1.state).toBe("loading" satisfies RequestStateState);
				expect(stateSuccess1.state).toBe("success" satisfies RequestStateState);
				expect((stateSuccess1 as RequestSucceed<number>).data).toBe(value1);

				const value2 = 400;
				void requestState$.request(timeout, value2);

				const [stateLoading2, stateSuccess2] = await sem.tryRead(timeoutMax, 2);
				expect(stateLoading2.state).toBe("loading" satisfies RequestStateState);
				expect((stateLoading2 as RequestLoading<number, number>).data).toBe(value1);
				expect(stateSuccess2.state).toBe("success" satisfies RequestStateState);
				expect((stateSuccess2 as RequestSucceed<number>).data).toBe(value2);
			})
			.finally(() => subscription.unsubscribe());
	});

	it("should be ok on fails (via observable)", () => {
		const requestState$ = createRSS();

		const sem = new ProducerConsumer<RequestState<number, number>>();
		const subscription = requestState$.subscribe(value => sem.write(value));

		// Everything done here to avoid leaks
		return sem
			.tryReadOne(timeout)
			.then(async stateInit => {
				expect(stateInit.state).toBe("init" satisfies RequestStateState);

				const value = -200;
				void requestState$.request(timeout, value).catch(() => void 0);

				const [stateLoading, stateFailed] = await sem.tryRead(timeoutMax, 2);
				expect(stateLoading.state).toBe("loading" satisfies RequestStateState);
				expect(stateFailed.state).toBe("failed" satisfies RequestStateState);
				expect((stateFailed as RequestFailed<number, number>).error).toBe(value);
			})
			.finally(() => subscription.unsubscribe());
	});
});
