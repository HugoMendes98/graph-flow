import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GraphArcController } from "./arc/graph-arc.controller";
import { GraphArcService } from "./arc/graph-arc.service";
import { GraphController } from "./graph.controller";
import { GRAPH_ENTITIES } from "./graph.entities";
import { GraphService } from "./graph.service";
import { GraphNodeController } from "./node/graph-node.controller";
import { GraphNodeService } from "./node/graph-node.service";

@Module({
	controllers: [GraphArcController, GraphController, GraphNodeController],
	exports: [GraphService],
	imports: [MikroOrmModule.forFeature(GRAPH_ENTITIES)],
	providers: [GraphArcService, GraphService, GraphNodeService]
})
export class GraphModule {}
