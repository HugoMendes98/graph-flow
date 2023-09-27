import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UserDto } from "~/lib/common/app/user/dtos";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request-state.subject";
import { TranslationModule } from "~/lib/ng/lib/translation";

import { AuthInterceptor } from "../../auth.interceptor";
import { AuthModule } from "../../auth.module";
import { AuthService } from "../../auth.service";
import { AuthLogin, LoginCardComponent } from "../../components/login-card/login-card.component";

@Component({
	standalone: true,
	styleUrls: ["./login.view.scss"],
	templateUrl: "./login.view.html",

	imports: [
		AuthModule,
		CommonModule,
		LoginCardComponent,
		MatCardModule,
		MatProgressSpinnerModule,
		TranslationModule
	]
})
export class LoginView implements OnInit, OnDestroy {
	/**
	 * The URL to redirect when the user logs
	 */
	@Input()
	public redirectUrl?: string;

	protected readonly loginState$ = new RequestStateSubject((login: AuthLogin) =>
		this.interceptor.runUnprotected(() => this.service.login(login))
	);
	protected loginState = this.loginState$.getValue();

	/**
	 * Is currently redirecting ?
	 * If yes, the connected user is set
	 */
	protected redirecting: UserDto | false = false;

	private readonly subscription = new Subscription();

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param interceptor injected
	 * @param router injected
	 */
	public constructor(
		private readonly service: AuthService,
		private readonly interceptor: AuthInterceptor,
		private readonly router: Router
	) {}

	/** @inheritDoc */
	public ngOnInit() {
		const state = this.service.userState$.getValue();
		if (state.type === "connected") {
			// Redirect to the profile if already connected
			this.redirect(state.user, this.redirectUrl ?? "/auth/profile");
			return;
		}

		this.subscription.add(this.loginState$.subscribe(state => (this.loginState = state)));
	}
	/** @inheritDoc */
	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/**
	 * Handles the login submit
	 *
	 * @param login parameters to use for a login
	 */
	protected handleLoginSubmit(login: AuthLogin) {
		this.loginState$
			.request(login)
			.then(({ user }) => this.redirect(user, this.redirectUrl))
			// Avoid uncaught error in console
			.catch(() => void 0);
	}

	private redirect(user: UserDto, redirectUrl = "/") {
		this.redirecting = user;
		// Some time to let the animation
		setTimeout(() => void this.router.navigateByUrl(redirectUrl, { replaceUrl: true }), 1250);
	}
}
