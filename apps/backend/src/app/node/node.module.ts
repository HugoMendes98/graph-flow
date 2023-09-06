import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { NodeController } from "./node.controller";
import { NODE_ENTITIES } from "./node.entities";
import { NodeService } from "./node.service";

/**
 * Module for "node" management
 */
@Module({
	controllers: [NodeController],
	exports: [NodeService],
	imports: [MikroOrmModule.forFeature(NODE_ENTITIES)],
	providers: [NodeService]
})
export class NodeModule {}
