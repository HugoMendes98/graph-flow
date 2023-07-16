import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GRAPH_ENTITIES } from "./graph.entities";
import { GraphService } from "./graph.service";
import { GraphNodeService } from "./node/graph-node.service";

@Module({
	exports: [GraphService, GraphNodeService],
	imports: [MikroOrmModule.forFeature(GRAPH_ENTITIES)],
	providers: [GraphService, GraphNodeService]
})
export class GraphModule {}
