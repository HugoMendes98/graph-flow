import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { UserEntity } from "../user/user.entity";

/**
 * The authenticated user data on Request
 */
export type AuthUser = UserEntity;

/**
 * Inject the connected user from the request if exists
 */
export const AuthUserParam = createParamDecorator<never, ExecutionContext>(
	(_, context) => context.switchToHttp().getRequest<Express.Request>().user
);

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- TODO: set it as a custom global type AND still working for e2e tests
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface -- For declaration merging
		interface User extends AuthUser {}
	}
}
