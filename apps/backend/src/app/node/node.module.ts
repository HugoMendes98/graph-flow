import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { NodeExecutor } from "./executor";
import { NodeController } from "./node.controller";
import { NODE_ENTITIES } from "./node.entities";
import { NodeService } from "./node.service";

@Module({
	controllers: [NodeController],
	exports: [NodeService],
	imports: [MikroOrmModule.forFeature(NODE_ENTITIES)],
	providers: [NodeExecutor, NodeService]
})
export class NodeModule {}
