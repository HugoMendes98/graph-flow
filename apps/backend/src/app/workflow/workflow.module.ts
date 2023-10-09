import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { WorkflowController } from "./workflow.controller";
import { WorkflowEntity } from "./workflow.entity";
import { WorkflowExecutor } from "./workflow.executor";
import { WorkflowScheduler } from "./workflow.scheduler";
import { WorkflowService } from "./workflow.service";
import { GraphModule } from "../graph/graph.module";
import { NodeModule } from "../node/node.module";

/**
 * Module for {@link WorkflowEntity} management
 */
@Module({
	controllers: [WorkflowController],
	exports: [WorkflowService],
	imports: [GraphModule, MikroOrmModule.forFeature([WorkflowEntity]), NodeModule],
	providers: [WorkflowExecutor, WorkflowScheduler, WorkflowService]
})
export class WorkflowModule {}
