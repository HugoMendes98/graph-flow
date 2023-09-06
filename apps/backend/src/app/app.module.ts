import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { GraphModule } from "./graph/graph.module";
import { NodeModule } from "./node/node.module";
import { UserModule } from "./user/user.module";
import { WorkflowModule } from "./workflow/workflow.module";
import { HealthModule } from "../health/health.module";
import { OrmModule } from "../orm/orm.module";

/**
 * Main module for the application
 */
@Module({
	imports: [
		AuthModule,
		CategoryModule,
		GraphModule,
		HealthModule,
		NodeModule,
		OrmModule,
		UserModule,
		WorkflowModule
	]
})
export class AppModule {}
