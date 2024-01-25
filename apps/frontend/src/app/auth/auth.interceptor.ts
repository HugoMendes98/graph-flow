import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { catchError, lastValueFrom, Observable, throwError } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	/**
	 * Is the protection enabled in the interceptor
	 */
	private protected = true;

	/**
	 * The basic path to the login component
	 */
	private readonly pathLogin = AuthService.createLoginUrlTree(
		this.router
	).toString();

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param router injected
	 * @param snackBar injected
	 * @param translateService injected
	 */
	public constructor(
		private readonly service: AuthService,
		private readonly router: Router,
		private readonly snackBar: MatSnackBar,
		private readonly translateService: TranslateService
	) {}

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

	/** @inheritDoc */
	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// TODO: "random" token refresh?

		return next.handle(request).pipe(
			catchError((error: unknown) => {
				if (this.service.userState$.getValue().type === "connected") {
					this.service.disconnectUser();
				}

				if (
					this.protected &&
					AuthService.isAnUnauthorizedError(error)
				) {
					const { url } = this.router.routerState.snapshot;
					// TODO: better?
					if (!url.startsWith(this.pathLogin)) {
						void this.redirect(url);
					}
				}

				return throwError(() => error);
			})
		);
	}

	/**
	 * Redirects the user on an unauthorized error
	 *
	 * @param redirect "redirectUrl" after successful login
	 */
	private async redirect(redirect: string) {
		const { type } = this.service.userState$.getValue();

		this.snackBar.open(
			(await lastValueFrom(
				type === "connected"
					? this.translateService.get(
							"interceptors.auth.redirect.connected"
						)
					: this.translateService.get(
							"interceptors.auth.redirect.unconnected"
						)
			)) as string,
			(await lastValueFrom(
				this.translateService.get("actions.ok")
			)) as string,
			{ duration: 5000, horizontalPosition: "end" }
		);

		await this.router.navigateByUrl(
			AuthService.createLoginUrlTree(this.router, redirect)
		);
	}
}
