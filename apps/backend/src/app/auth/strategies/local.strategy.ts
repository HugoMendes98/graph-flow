import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";

import { AuthService } from "../auth.service";

export const STRATEGY_LOCAL_NAME = "local";

/**
 * Strategy used for local login
 */
@Injectable()
export class LocalStrategy
	extends PassportStrategy(Strategy, STRATEGY_LOCAL_NAME)
	implements AbstractStrategy
{
	public constructor(private readonly authService: AuthService) {
		super({
			passwordField: "password" satisfies keyof AuthLoginDto,
			usernameField: "email" satisfies keyof AuthLoginDto
		});
	}

	/**
	 * @inheritDoc
	 */
	public validate(email: string, password: string) {
		return this.authService.validateCredentials(email, password);
	}
}
