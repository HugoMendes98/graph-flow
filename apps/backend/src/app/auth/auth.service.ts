import { NotFoundError } from "@mikro-orm/core";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { AuthSuccessDto } from "~/lib/common/app/auth/dtos/auth.success.dto";

import { JWTPayload } from "./auth.types";
import { getConfiguration } from "../../configuration";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

/**
 * Service managing authentication
 */
@Injectable()
export class AuthService {
	/**
	 * Compares the given string against the given hash
	 *
	 * @param clear the string not hashed
	 * @param hash to string hashed
	 * @returns if the 2 string are "equal"
	 */
	public static compare(clear: string, hash: string) {
		return bcryptjs.compare(clear, hash);
	}

	/**
	 * Hashes the given string with a random salt
	 *
	 * @param password the password to hash
	 * @returns the hashed string
	 */
	public static hash(password: string) {
		return bcryptjs.hash(password, 9 + Math.round(Math.random() * 3));
	}

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param jwtService injected
	 * @param userService injected
	 */
	public constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

	/**
	 * Logs a user by creating its JWT.
	 *
	 * @param user The user to log
	 * @returns The success message with the access_token
	 */
	public async login(user: User): Promise<AuthSuccessDto> {
		const access_token = await this.jwtService.signAsync({
			_id: user._id,
			email: user.email,
			method: "local"
		} satisfies JWTPayload);

		// To get the real time of the JWT
		const { exp } = this.jwtService.decode(access_token) as JWTPayload & { exp: number };
		return {
			access_token,
			expires_at: exp * 1000,
			expires_in: getConfiguration().authentication.timeout * 1000
		};
	}

	/**
	 * Validates the credentials against the local database
	 *
	 * @param email The email of the credentials
	 * @param password the password (in plain text) of the credentials
	 * @returns The user if the credentials are valid
	 */
	public async validateCredentials(email: string, password: string) {
		return this.userService
			.findByCredentials(email)
			.then(async ({ password: hash, ...user }) => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- populated
				if (await AuthService.compare(password, hash!)) {
					return user;
				}

				throw new UnauthorizedException();
			})
			.catch((error: unknown) => {
				if (error instanceof NotFoundError) {
					throw new UnauthorizedException();
				}

				throw error;
			});
	}

	/**
	 * Validates a given payload
	 *
	 * @param payload the JWT payload to validate
	 * @returns the user if validated
	 */
	public async validateJWT(payload: JWTPayload) {
		return this.userService
			.findById(payload._id)
			.catch((error: unknown) => {
				if (error instanceof NotFoundError) {
					throw new UnauthorizedException();
				}

				throw error;
			})
			.then(user => {
				if (user.email !== payload.email) {
					// In case the token is invalid or the user changed
					throw new UnauthorizedException();
				}

				return user;
			});
	}
}
