import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies";
import { getConfiguration } from "../../configuration";
import { UserModule } from "../user/user.module";

/**
 * Module for authentication management
 */
@Module({
	controllers: [AuthController],
	imports: [
		JwtModule.registerAsync({
			useFactory: () => {
				const {
					authentication: { secret, timeout }
				} = getConfiguration();
				return { secret, signOptions: { expiresIn: timeout } };
			}
		}),
		PassportModule.register({ defaultStrategy: "local" }),
		UserModule
	],
	providers: [AuthService, JwtStrategy, LocalStrategy]
})
export class AuthModule {}
