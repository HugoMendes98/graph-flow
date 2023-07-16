import { Injectable } from "@nestjs/common";

import { Graph } from "./graph.entity";
import { GraphRepository } from "./graph.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [graphs]{@link Graph}.
 */
@Injectable()
export class GraphService extends EntityService<Graph, object, void> {
	// TODO: create and update types

	public constructor(repository: GraphRepository) {
		super(repository);
	}
}
