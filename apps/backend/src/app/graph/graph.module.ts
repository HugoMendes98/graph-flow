import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GraphArcService } from "./arc/graph-arc.service";
import { GRAPH_ENTITIES } from "./graph.entities";
import { GraphService } from "./graph.service";
import { GraphNodeService } from "./node/graph-node.service";

@Module({
	exports: [GraphService],
	imports: [MikroOrmModule.forFeature(GRAPH_ENTITIES)],
	providers: [GraphArcService, GraphService, GraphNodeService]
})
export class GraphModule {}
