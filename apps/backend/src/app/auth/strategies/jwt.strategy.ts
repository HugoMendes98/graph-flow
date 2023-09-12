import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authOptions } from "~/lib/common/options";

import { getConfiguration } from "../../../configuration";
import { AuthService } from "../auth.service";
import { JWTPayload } from "../auth.types";

/**
 * Name for {@link JwtStrategy} strategy
 */
export const STRATEGY_JWT_NAME = "jwt";

/**
 * Strategy that manages determines the connected user given a JWT
 */
@Injectable()
export class JwtStrategy
	extends PassportStrategy(Strategy, STRATEGY_JWT_NAME)
	implements AbstractStrategy
{
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param authService injected
	 */
	public constructor(private readonly authService: AuthService) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				req =>
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- In case it's falsy
					(req.cookies as Partial<Record<string, string>>)[authOptions.cookies.name] ||
					null
			]),
			secretOrKey: getConfiguration().authentication.secret
		});
	}

	/**
	 * Validates a JWT payload
	 *
	 * @param payload the decoded JWT content
	 * @returns the user for the given payload
	 */
	public validate(payload: JWTPayload) {
		return this.authService.validateJWT(payload);
	}
}
