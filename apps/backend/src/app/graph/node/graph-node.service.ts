import { Injectable } from "@nestjs/common";
import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/lib/common/dtos/graph/node";

import { GraphNode } from "./graph-node.entity";
import { GraphNodeRepository } from "./graph-node.repository";
import { EntityService } from "../../_lib/entity";

export type GraphNodeCreate = GraphNodeCreateDto & Pick<GraphNode, "__graph">;

/**
 * Service to manages [graph-nodes]{@link GraphNode}.
 */
@Injectable()
export class GraphNodeService extends EntityService<
	GraphNode,
	GraphNodeCreate,
	GraphNodeUpdateDto
> {
	public constructor(repository: GraphNodeRepository) {
		super(repository);
	}
}
