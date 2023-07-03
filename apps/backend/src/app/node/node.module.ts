import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { NodeController } from "./node.controller";
import { Node } from "./node.entity";
import { NodeService } from "./node.service";

@Module({
	controllers: [NodeController],
	exports: [NodeService],
	imports: [MikroOrmModule.forFeature([Node])],
	providers: [NodeService]
})
export class NodeModule {}
