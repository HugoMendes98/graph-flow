export interface Environment {
	backend: {
		/**
		 * Base url to the server api, should not end with `/`.
		 *
		 * **Info**: the API can contain a `/api` prefix and,
		 *	perhaps later, a `/socket` for socket connections (or SSE)
		 */
		url: string;
	};
}
