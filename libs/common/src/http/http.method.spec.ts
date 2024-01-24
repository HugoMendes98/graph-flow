import { isAHttpMethod } from "./http.method";

describe("HTTP methods", () => {
	describe("`isAHttpMethod` function", () => {
		it("should return that a string is a HTTP method", () => {
			const methods: string[] = ["DELETE", "GET", "PATCH", "POST", "PUT"];
			methods.push(...methods.map(method => method.toLowerCase()));

			for (const method of methods) {
				expect(isAHttpMethod(method)).toBe(true);
			}
		});

		it("should return that a string is not a HTTP method", () => {
			const methods: string[] = [
				"UPDATE",
				"got",
				"Post",
				"REMOVE",
				"create"
			];

			for (const method of methods) {
				expect(isAHttpMethod(method)).toBe(false);
			}
		});
	});
});
