import { inject } from "@angular/core";
import { CanActivateFn, CanActivateChildFn, Router } from "@angular/router";
import { map } from "rxjs";

import { AuthService } from "./auth.service";

/**
 * The guard that checks that the user is connected
 *
 * @param route same as in {@link CanActivateFn}
 * @param state same as in {@link CanActivateFn}
 * @returns same as in {@link CanActivateFn}
 *
 * @see {@link CanActivateFn}
 * @see {@link CanActivateChildFn}
 */
export const authGuard: CanActivateChildFn & CanActivateFn = (route, state) => {
	const service = inject(AuthService);
	const router = inject(Router);

	return service.userState$.pipe(
		map(({ type }) =>
			type === "connected" ? true : AuthService.createLoginUrlTree(router, state.url)
		)
	);
};
