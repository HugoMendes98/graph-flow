import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	/**
	 * Is the protection enabled in the interceptor
	 */
	private protected = true;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param router injected
	 */
	public constructor(private readonly service: AuthService, private readonly router: Router) {}

	/**
	 * Runs a function while the interceptor "protection" is disabled
	 *
	 * @param fn function to run when the interceptor is disabled
	 * @returns the value of the unprotected function
	 */
	public async runUnprotected<T>(fn: () => Promise<T> | T): Promise<T> {
		this.protected = false;

		const result = await fn();

		this.protected = true;
		return result;
	}

	/**
	 * @inheritDoc
	 */
	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error: unknown) => {
				if (this.protected && AuthService.isAnUnauthorizedError(error)) {
					const { url } = this.router.routerState.snapshot;

					void this.router.navigateByUrl(
						AuthService.createLoginUrlTree(this.router, url)
					);
				}

				return throwError(() => error);
			})
		);
	}
}
