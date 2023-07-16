import { Injectable } from "@nestjs/common";
import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/app/common/dtos/graph/node";

import { GraphNode } from "./graph-node.entity";
import { GraphNodeRepository } from "./graph-node.repository";
import { EntityService } from "../../_lib/entity";

/**
 * Service to manages [graph-nodes]{@link GraphNode}.
 */
@Injectable()
export class GraphNodeService extends EntityService<
	GraphNode,
	GraphNodeCreateDto,
	GraphNodeUpdateDto
> {
	public constructor(repository: GraphNodeRepository) {
		super(repository);
	}
}
