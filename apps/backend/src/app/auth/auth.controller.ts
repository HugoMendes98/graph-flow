import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthLoginDto, AuthRefreshDto } from "~/lib/common/app/auth/dtos";
import { AuthSuccessDto } from "~/lib/common/app/auth/dtos/auth.success.dto";
import { AUTH_ENDPOINT_PREFIX, AuthEndpoint, AuthEndpoints } from "~/lib/common/app/auth/endpoints";
import { UserDto } from "~/lib/common/app/user/dtos";
import { authOptions } from "~/lib/common/options";

import { UseAuth } from "./auth.guard";
import { AuthLocalGuard } from "./auth.local-guard";
import { AuthService } from "./auth.service";
import { User as UserEntity, User } from "../user/user.entity";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- TODO: set it as a custom global type AND still working for e2e tests
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface -- For declaration merging
		interface User extends UserEntity {}
	}
}

/**
 * The controller for authentication.
 */
@ApiTags("Auth")
@Controller(AUTH_ENDPOINT_PREFIX)
export class AuthController implements AuthEndpoint {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: AuthService) {}

	/**
	 * @inheritDoc
	 */
	@ApiOkResponse({ type: UserDto })
	@Get(AuthEndpoints.PROFILE)
	@UseAuth()
	public getProfile(@Req() req?: Express.Request): Promise<UserDto> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From decorator and the Guard
		return Promise.resolve(req!.user!);
	}

	/**
	 * @inheritDoc
	 */
	@ApiCreatedResponse({ type: AuthSuccessDto })
	@Post(AuthEndpoints.LOGIN)
	@UseGuards(AuthLocalGuard)
	public login(
		@Body() body: AuthLoginDto,
		@Req() req?: Express.Request,
		@Res({ passthrough: true }) res?: Response
	) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From guards and decorators (optional for the interface)
		return this.loginOrRefresh(req!.user!, body, res!);
	}

	/**
	 * @inheritDoc
	 */
	@ApiCreatedResponse({ type: AuthSuccessDto })
	@Post(AuthEndpoints.REFRESH)
	@UseAuth()
	public refresh(
		@Body() body: AuthRefreshDto,
		@Req() req?: Express.Request,
		@Res({ passthrough: true }) res?: Response
	) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From guards and decorators (optional for the interface)
		return this.loginOrRefresh(req!.user!, body, res!);
	}

	private loginOrRefresh(user: User, body: AuthRefreshDto, res: Response) {
		return this.service.login(user).then(token => {
			if (body.cookie) {
				res.cookie(authOptions.cookies.name, token.access_token, {
					expires: new Date(token.expires_at),
					httpOnly: true,
					sameSite: "none",
					secure: true
				});
			}

			return token;
		});
	}
}
