import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import { AuthLoginDto, AuthRefreshDto } from "~/lib/common/app/auth/dtos";
import { AuthSuccessDto } from "~/lib/common/app/auth/dtos/auth.success.dto";
import {
	AUTH_ENDPOINT_PREFIX,
	AuthEndpoint,
	AuthEndpoints
} from "~/lib/common/app/auth/endpoints";
import { UserDto } from "~/lib/common/app/user/dtos";
import { authOptions } from "~/lib/common/options";

import { UseAuth } from "./auth.guard";
import { AuthLocalGuard } from "./auth.local-guard";
import { AuthService } from "./auth.service";
import { AuthUser, AuthUserParam } from "./auth.user.param";
import { UserEntity } from "../user/user.entity";

/**
 * The controller for authentication.
 */
@ApiTags("Auth")
@Controller(AUTH_ENDPOINT_PREFIX)
export class AuthController implements AuthEndpoint {
	/**
	 * Default cookie options
	 */
	private readonly cookieOptions: CookieOptions = {
		httpOnly: true,
		sameSite: "none",
		secure: true
	};

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: AuthService) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: UserDto })
	@Get(AuthEndpoints.PROFILE)
	@UseAuth()
	public getProfile(@AuthUserParam() user?: AuthUser): Promise<UserDto> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From decorator and the Guard
		return Promise.resolve(user!);
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: AuthSuccessDto })
	@Post(AuthEndpoints.LOGIN)
	@UseGuards(AuthLocalGuard)
	public login(
		@Body() body: AuthLoginDto,
		@AuthUserParam() user?: AuthUser,
		@Res({ passthrough: true }) res?: Response
	) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From guards and decorators (optional for the interface)
		return this.loginOrRefresh(user!, body, res!);
	}

	/** @inheritDoc */
	@ApiOkResponse()
	@Post(AuthEndpoints.LOGOUT)
	public logout(@Res({ passthrough: true }) res?: Response) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From guards and decorators (optional for the interface)
		res!.clearCookie(authOptions.cookies.name, this.cookieOptions);
		return Promise.resolve();
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: AuthSuccessDto })
	@Post(AuthEndpoints.REFRESH)
	@UseAuth()
	public refresh(
		@Body() body: AuthRefreshDto,
		@AuthUserParam() user?: AuthUser,
		@Res({ passthrough: true }) res?: Response
	) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From guards and decorators (optional for the interface)
		return this.loginOrRefresh(user!, body, res!);
	}

	private loginOrRefresh(
		user: UserEntity,
		body: AuthRefreshDto,
		res: Response
	) {
		return this.service.login(user).then(token => {
			if (body.cookie) {
				res.cookie(authOptions.cookies.name, token.access_token, {
					...this.cookieOptions,
					expires: new Date(token.expires_at)
				});
			}

			return token;
		});
	}
}
