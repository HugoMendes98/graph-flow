import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";

import { GraphArcController } from "./arc/graph-arc.controller";
import { GraphArcService } from "./arc/graph-arc.service";
import { GraphExecutor } from "./executor";
import { GraphController } from "./graph.controller";
import { GRAPH_ENTITIES } from "./graph.entities";
import { GraphService } from "./graph.service";
import { GraphNodeController } from "./node/graph-node.controller";
import { NodeModule } from "../node/node.module";

/**
 * Module for "graph", "graph-node" & "graph-arc" management
 */
@Module({
	controllers: [GraphArcController, GraphController, GraphNodeController],
	exports: [GraphService],
	imports: [forwardRef(() => NodeModule), MikroOrmModule.forFeature(GRAPH_ENTITIES)],
	providers: [GraphArcService, GraphExecutor, GraphService]
})
export class GraphModule {}
