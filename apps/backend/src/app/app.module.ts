import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { GroupModule } from "./group/group.module";
import { UserModule } from "./user/user.module";
import { HealthModule } from "../health/health.module";
import { OrmModule } from "../orm/orm.module";

@Module({
	imports: [AuthModule, GroupModule, HealthModule, OrmModule, UserModule]
})
export class AppModule {}
