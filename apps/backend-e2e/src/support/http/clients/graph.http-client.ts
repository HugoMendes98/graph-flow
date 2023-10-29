import {
	generateGraphArcsEndpoint,
	generateGraphNodesEndpoint,
	GraphJSON
} from "~/lib/common/app/graph/endpoints";
import { GRAPHS_ENDPOINT_PREFIX } from "~/lib/common/app/graph/endpoints/graph.endpoint";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityHttpClient } from "./_lib/entity.http-client";
import { GraphArcHttpClient } from "./graph";
import { GraphNodeHttpClient } from "./graph/graph-node.http-client";

export class GraphHttpClient extends EntityHttpClient<GraphJSON> {
	public override getEndpoint(): string {
		return GRAPHS_ENDPOINT_PREFIX;
	}

	public forArcs(graphId: EntityId) {
		return new GraphArcHttpClient(generateGraphArcsEndpoint(graphId));
	}

	public forNodes(graphId: EntityId) {
		return new GraphNodeHttpClient(generateGraphNodesEndpoint(graphId));
	}
}
