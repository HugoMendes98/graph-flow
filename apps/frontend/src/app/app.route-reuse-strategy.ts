import { Provider } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	BaseRouteReuseStrategy,
	RouteReuseStrategy
} from "@angular/router";

/**
 * Custom Route strategy to reuse the same component on route change
 */
export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
	/**
	 * A provider for this strategy
	 *
	 * @returns Provider to use in the app module
	 */
	public static get PROVIDER(): Provider {
		return { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy };
	}

	/** @inheritDoc */
	public override shouldReuseRoute(
		future: ActivatedRouteSnapshot,
		curr: ActivatedRouteSnapshot
	): boolean {
		// TODO: use of a custom data value?

		// For `Workflow` view
		if (future.component === curr.component) {
			return true;
		}

		return super.shouldReuseRoute(future, curr);
	}
}
