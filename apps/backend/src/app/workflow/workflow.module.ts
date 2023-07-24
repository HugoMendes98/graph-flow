import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { WorkflowController } from "./workflow.controller";
import { Workflow } from "./workflow.entity";
import { WorkflowService } from "./workflow.service";
import { GraphModule } from "../graph/graph.module";

@Module({
	controllers: [WorkflowController],
	exports: [WorkflowService],
	imports: [GraphModule, MikroOrmModule.forFeature([Workflow])],
	providers: [WorkflowService]
})
export class WorkflowModule {}
