import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";

import { NodeExecutor } from "./executor/node.executor";
import { NodeInputController } from "./input/node-input.controller";
import { NodeInputService } from "./input/node-input.service";
import { NodeController } from "./node.controller";
import { NODE_ENTITIES } from "./node.entities";
import { NodeService } from "./node.service";
import { NodeOutputController } from "./output/node-output.controller";
import { NodeOutputService } from "./output/node-output.service";
import { GraphModule } from "../graph/graph.module";

/**
 * Module for "node" management
 */
@Module({
	controllers: [NodeController, NodeInputController, NodeOutputController],
	exports: [NodeExecutor, NodeService],
	imports: [
		forwardRef(() => GraphModule),
		MikroOrmModule.forFeature(NODE_ENTITIES)
	],
	providers: [NodeExecutor, NodeInputService, NodeOutputService, NodeService]
})
export class NodeModule {}
