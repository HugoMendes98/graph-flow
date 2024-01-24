import { applyDecorators, Injectable, UseGuards } from "@nestjs/common";
import { AuthGuard as PassportGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";

import { STRATEGY_JWT_NAME } from "./strategies";

/**
 * The default guard for any authentication
 */
@Injectable()
export class AuthGuard extends PassportGuard(STRATEGY_JWT_NAME) {}

/**
 * Creates a decorator with the needed decorators for authentication
 *
 * @returns The decorator applying Api decorators and guard
 */
export function UseAuth() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiCookieAuth(),
		UseGuards(AuthGuard)
	);
}
