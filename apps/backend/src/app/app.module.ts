import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "../health/health.module";
import { OrmModule } from "../orm/orm.module";

@Module({
	imports: [AuthModule, HealthModule, OrmModule, UserModule]
})
export class AppModule {}
