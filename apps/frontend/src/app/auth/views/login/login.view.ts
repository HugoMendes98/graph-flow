import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ApiModule } from "~/lib/ng/lib/api";
import { AuthApiService } from "~/lib/ng/lib/api/auth-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request-state.subject";
import { TranslationModule } from "~/lib/ng/lib/translation";

import { AuthLogin, LoginCardComponent } from "../../components/login-card/login-card.component";

@Component({
	standalone: true,
	styleUrls: ["./login.view.scss"],
	templateUrl: "./login.view.html",

	imports: [
		ApiModule,
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
		this.service
			.login({ cookie: true, ...login })
			.then(auth => this.service.getProfile().then(profile => ({ auth, profile })))
			.then(data => {
				setTimeout(() => void this.router.navigateByUrl(this.redirectUrl ?? "/"), 1250);

				return data;
			})
	);
	protected loginState = this.loginState$.getValue();

	private readonly subscription = new Subscription();

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param router injected
	 */
	public constructor(private readonly service: AuthApiService, private readonly router: Router) {}

	/** @inheritDoc */
	public ngOnInit() {
		this.subscription.add(this.loginState$.subscribe(state => (this.loginState = state)));
	}
	/** @inheritDoc */
	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
