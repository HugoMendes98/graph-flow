import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthLoginDto, AuthSuccessDto } from "~/lib/common/app/auth/dtos";
import { UserDto } from "~/lib/common/app/user/dtos";
import { ApiModule } from "~/lib/ng/lib/api";
import { AuthApiService } from "~/lib/ng/lib/api/auth-api";

import { LoginView } from "./views/login/login.view";

export type AuthLogin = Omit<AuthLoginDto, "cookie">;

/**
 * When the user of the {@link AuthService} is connected
 */
export interface AuthUserStateConnected extends Pick<AuthSuccessDto, "expires_at"> {
	/**
	 * The connected user
	 */
	user: UserDto;
}

/**
 * When there is no connected user in {@link AuthService}
 */
export interface AuthUserStateUnconnected {
	/**
	 * The previously connected user if it has been logged out
	 */
	user?: UserDto;
}

/**
 * State of the user in {@link AuthService}
 */
export type AuthUserState =
	| (AuthUserStateConnected & { type: "connected" })
	| (AuthUserStateUnconnected & { type: "unconnected" });

@Injectable({ deps: [ApiModule], providedIn: "root" })
export class AuthService {
	/**
	 * With lazy modules, the service can be duplicated.
	 * So this is static so it is shared within all instances.
	 *
	 * // FIXME
	 */
	private static readonly userState = new BehaviorSubject<AuthUserState>({ type: "unconnected" });

	/**
	 * Creates a URLTree for the LoginView
	 *
	 * @param router to create the URLTree from
	 * @param redirectUrl url to load after a successful login
	 * @returns UrlTree for the login view
	 */
	public static createLoginUrlTree(router: Router, redirectUrl?: string) {
		const queryParams: Pick<LoginView, "redirectUrl"> =
			redirectUrl && redirectUrl !== "/" ? { redirectUrl } : {};
		return router.createUrlTree(["/auth/login"], { queryParams });
	}

	/**
	 * Determines if a given parameter is a HTTP Unauthorized error
	 *
	 * @param error the error to test
	 * @returns if the error is an HTTP Unauthorized
	 */
	public static isAnUnauthorizedError(error: unknown): error is HttpErrorResponse {
		return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
	}

	/**
	 * State of the current (possibly) connected user
	 */
	public readonly userState$: Observable<AuthUserState> &
		Pick<BehaviorSubject<AuthUserState>, "getValue">;

	/**
	 * Subject for authUserState
	 */
	private readonly userState = AuthService.userState;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param apiService injected
	 */
	public constructor(private readonly apiService: AuthApiService) {
		// This is just for type checking
		this.userState$ = this.userState;
	}

	/**
	 * Logs a user with the given credentials
	 *
	 * @param body credentials
	 * @returns the connected user
	 */
	public login(body: AuthLoginDto) {
		return this.apiService
			.login({ ...body, cookie: true })
			.then(success => this.onAuthSuccess(success));
	}

	/**
	 * Logs out the connected user
	 *
	 * @returns the updated state
	 */
	public logout() {
		return this.apiService.logout().then(() => this.disconnectUser());
	}

	/**
	 * Refreshes the current connection
	 *
	 * @returns the connected user
	 */
	public refresh() {
		return this.apiService
			.refresh({ cookie: true })
			.then(success => this.onAuthSuccess(success));
	}

	/**
	 * Disconnects user from the service.
	 * No request made
	 *
	 * @returns the state after the "logout"
	 */
	public disconnectUser() {
		const { user } = this.userState.getValue();

		const state: AuthUserStateUnconnected = { user };
		this.userState.next({ ...state, type: "unconnected" });
		return state;
	}

	/**
	 * Changes state of connected user
	 *
	 * @param success the result of a sign in request
	 * @returns the connected user
	 */
	private onAuthSuccess(success: AuthSuccessDto) {
		return this.apiService.getProfile().then(user => {
			const state: AuthUserStateConnected = { expires_at: success.expires_at, user };
			this.userState.next({ ...state, type: "connected" });
			return state;
		});
	}
}
