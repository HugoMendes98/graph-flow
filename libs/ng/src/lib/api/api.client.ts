import {
	HttpClient,
	HttpClientModule,
	HttpEvent,
	HttpHeaders,
	HttpParams,
	HttpResponse
} from "@angular/common/http";
import { Inject, NgModule, Optional } from "@angular/core";
import { lastValueFrom, tap } from "rxjs";
import { HttpMethod } from "~/lib/common/http";

export interface ApiClientConfig {
	/**
	 * Base url to the server api, should not end with `/`.
	 */
	url: string;
}

/**
 * The API client provider  token
 */
export const API_CLIENT_CONFIG_TOKEN = "_API_CLIENT_CONFIG_";

/**
 * Request options
 */
export interface RequestOptions {
	/**
	 * Headers to construct a request
	 */
	headers?: HttpHeaders | Record<string, string[] | string>;
	/**
	 * Function called when observing events.
	 */
	observeEvent?: <T>(event: HttpEvent<T>) => void;
	/**
	 * HTTP query parameters to add to the request
	 */
	params?: HttpParams | Record<string, string[] | string>;
	reportProgress?: boolean;
}

@NgModule({
	exports: [HttpClientModule],
	imports: [HttpClientModule]
})
export class ApiClient {
	public constructor(
		public readonly http: HttpClient,
		@Inject(API_CLIENT_CONFIG_TOKEN)
		@Optional()
		private readonly config: ApiClientConfig = { url: "/api" }
	) {}

	/**
	 * "Construct" the url to connect with API backend
	 *
	 * @param endpoint the endpoint to concat (suppose to start with `/`)
	 * @returns the final url
	 */
	public getURL(endpoint?: string): string {
		const { url } = this.config;

		if (endpoint) {
			return `${url}${endpoint}`;
		}

		return url;
	}

	/**
	 * GET request
	 *
	 * @param endpoint should start with `/`
	 * @param options options of the request like headers, body, etc.
	 * @returns the response of the request
	 */
	public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>("GET", endpoint, options);
	}

	/**
	 * POST request
	 *
	 * @param endpoint should start with `/`
	 * @param body of the request.
	 * @param options options of the request like headers, body, etc.
	 * @returns the response of the request
	 */
	public post<T, U = unknown>(endpoint: string, body?: U, options?: RequestOptions): Promise<T> {
		return this.request<T>("POST", endpoint, { ...options, body });
	}

	/**
	 * PATCH request
	 *
	 * @param endpoint should start with `/`
	 * @param body body of the request.
	 * @param options options of the request like headers, body, etc.
	 * @returns the response of the request
	 */
	public patch<T, U = unknown>(endpoint: string, body?: U, options?: RequestOptions): Promise<T> {
		return this.request<T>("PATCH", endpoint, { ...options, body });
	}

	/**
	 * PUT request
	 *
	 * @param endpoint should start with `/`
	 * @param body body of the request.
	 * @param options options of the request like headers, body, etc.
	 * @returns the response of the request
	 */
	public put<T, U = unknown>(endpoint: string, body?: U, options?: RequestOptions): Promise<T> {
		return this.request<T>("PUT", endpoint, { ...options, body });
	}

	/**
	 * DELETE request
	 *
	 * @param endpoint should start with `/`
	 * @param options options of the request like headers, body, etc.
	 * @returns the response of the request
	 */
	public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request("DELETE", endpoint, options);
	}

	/**
	 *  Constructs a request.
	 *
	 * @param method The HTTP method
	 * @param endpoint The endpoint URL.
	 * @param options The HTTP options to send with the request.
	 * @returns A `Promise` of the requested body response.
	 */
	protected request<T>(
		method: HttpMethod,
		endpoint: string,
		options: RequestOptions & { body?: unknown } = {}
	): Promise<T> {
		const { observeEvent, ...reqOptions } = options;

		let request = this.http.request(method, this.getURL(endpoint), {
			...reqOptions,
			observe: observeEvent ? "events" : "body"
		});

		if (observeEvent) {
			// No need to subscribe as `lastValueForm` already does it
			request = request.pipe<HttpEvent<T>>(tap(value => observeEvent(value)));
		}

		return lastValueFrom(request).then(last =>
			observeEvent ? ((last as HttpResponse<T>).body as T) : (last as T)
		);
	}
}
