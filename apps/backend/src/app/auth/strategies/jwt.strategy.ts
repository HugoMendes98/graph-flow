import { Injectable } from "@nestjs/common";
import { AbstractStrategy, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authOptions } from "~/lib/common/options";

import { getConfiguration } from "../../../configuration";
import { AuthService } from "../auth.service";
import { JWTPayload } from "../auth.types";

export const STRATEGY_JWT_NAME = "jwt";

@Injectable()
export class JwtStrategy
	extends PassportStrategy(Strategy, STRATEGY_JWT_NAME)
	implements AbstractStrategy
{
	public constructor(private readonly authService: AuthService) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				req =>
					(req.cookies as Partial<Record<string, string>>)[authOptions.cookies.name] ||
					null
			]),
			secretOrKey: getConfiguration().authentication.secret
		});
	}

	public validate(payload: JWTPayload) {
		return this.authService.validateJWT(payload);
	}
}
