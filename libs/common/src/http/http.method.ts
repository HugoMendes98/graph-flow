type HttpMethodUpperCase = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

/**
 * The `method` can be all lower or upper case
 */
export type HttpMethod = HttpMethodUpperCase | Lowercase<HttpMethodUpperCase>;

/**
 * All available HTTP methods
 */
const allMethods: readonly HttpMethod[] = (
	["DELETE", "GET", "PATCH", "POST", "PUT"] satisfies HttpMethod[]
).reduce<HttpMethod[]>(
	(methods, method) => [
		...methods,
		method,
		method.toLowerCase() as HttpMethod
	],
	[]
);

/**
 * Verify that a given string is a valid HttpMethod
 *
 * @param method Method string to test
 * @returns If the given `method` is a valid [HttpMethod]{@link HttpMethod}
 */
export function isAHttpMethod(method: string): method is HttpMethod {
	return allMethods.includes(method as HttpMethod);
}
