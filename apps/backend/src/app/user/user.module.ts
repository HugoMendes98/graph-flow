import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

/**
 * Module for {@link User} management
 */
@Module({
	controllers: [UserController],
	exports: [UserService],
	imports: [MikroOrmModule.forFeature([User])],
	providers: [UserService]
})
export class UserModule {}
