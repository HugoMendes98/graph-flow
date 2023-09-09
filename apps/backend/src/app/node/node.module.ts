import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";

import { NodeExecutor } from "./executor";
import { NodeController } from "./node.controller";
import { NODE_ENTITIES } from "./node.entities";
import { NodeService } from "./node.service";
import { GraphModule } from "../graph/graph.module";

/**
 * Module for "node" management
 */
@Module({
	controllers: [NodeController],
	exports: [NodeService],
	imports: [forwardRef(() => GraphModule), MikroOrmModule.forFeature(NODE_ENTITIES)],
	providers: [NodeExecutor, NodeService]
})
export class NodeModule {}
