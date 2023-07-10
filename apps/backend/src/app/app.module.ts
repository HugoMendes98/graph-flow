import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { GraphModule } from "./graph/graph.module";
import { NodeModule } from "./node/node.module";
import { UserModule } from "./user/user.module";
import { WorkflowModule } from "./workflow/workflow.module";
import { HealthModule } from "../health/health.module";
import { OrmModule } from "../orm/orm.module";

@Module({
	imports: [
		AuthModule,
		CategoryModule,
		HealthModule,
		GraphModule,
		NodeModule,
		OrmModule,
		UserModule,
		WorkflowModule
	]
})
export class AppModule {}
