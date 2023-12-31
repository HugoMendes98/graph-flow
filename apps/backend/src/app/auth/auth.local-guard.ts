import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { isObservable, lastValueFrom } from "rxjs";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";

import { STRATEGY_LOCAL_NAME } from "./strategies";
import { AppValidationPipe } from "../_lib/app-validation.pipe";

/**
 * Auth guard for local login
 */
export class AuthLocalGuard extends AuthGuard(STRATEGY_LOCAL_NAME) {
	/**
	 * The pipe to apply before the guard
	 */
	private readonly pipe = new AppValidationPipe();

	/** @inheritDoc */
	public override async canActivate(context: ExecutionContext) {
		// To use the pipe before the guard
		// https://github.com/nestjs/nest/issues/767
		const body = (await this.pipe.transform(
			(this.getRequest(context) as import("express").Request).body,
			{ metatype: AuthLoginDto, type: "body" }
		)) as AuthLoginDto;

		const errors = await this.pipe.validate(body);
		if (errors.length) {
			throw this.pipe.createExceptionFactory()(errors);
		}

		const activate = super.canActivate(context);
		return isObservable(activate) ? lastValueFrom(activate) : activate;
	}
}
