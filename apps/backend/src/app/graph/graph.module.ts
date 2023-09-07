import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GraphArcController } from "./arc/graph-arc.controller";
import { GraphArcService } from "./arc/graph-arc.service";
import { GraphController } from "./graph.controller";
import { GRAPH_ENTITIES } from "./graph.entities";
import { GraphService } from "./graph.service";
import { GraphNodeController } from "./node/graph-node.controller";
import { GraphNodeService } from "./node/graph-node.service";
import { NodeModule } from "../node/node.module";

/**
 * Module for "graph", "graph-node" & "graph-arc" management
 */
@Module({
	controllers: [GraphArcController, GraphController, GraphNodeController],
	exports: [GraphNodeService, GraphService],
	imports: [MikroOrmModule.forFeature(GRAPH_ENTITIES), NodeModule],
	providers: [GraphArcService, GraphNodeService, GraphService]
})
export class GraphModule {}
