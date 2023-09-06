import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";

import { AuthService } from "../auth.service";

/**
 * Name for {@link LocalStrategy} strategy
 */
export const STRATEGY_LOCAL_NAME = "local";

/**
 * Strategy used for local login
 */
@Injectable()
export class LocalStrategy
	extends PassportStrategy(Strategy, STRATEGY_LOCAL_NAME)
	implements AbstractStrategy
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param authService injected
	 */
	public constructor(private readonly authService: AuthService) {
		super({
			passwordField: "password" satisfies keyof AuthLoginDto,
			usernameField: "email" satisfies keyof AuthLoginDto
		});
	}

	/**
	 * Validates a email/password credentials
	 *
	 * @param email of the credentials
	 * @param password of the credentials
	 * @returns the user for the given credentials
	 */
	public validate(email: string, password: string) {
		return this.authService.validateCredentials(email, password);
	}
}
