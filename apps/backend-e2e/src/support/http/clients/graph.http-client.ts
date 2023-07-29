import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { GraphDto } from "~/lib/common/dtos/graph";
import { generateGraphArcsEndpoint, generateGraphNodesEndpoint } from "~/lib/common/endpoints/gaph";
import { GRAPHS_ENDPOINT_PREFIX } from "~/lib/common/endpoints/gaph/graph.endpoint";

import { EntityHttpClient } from "./_lib/entity.http-client";
import { GraphArcHttpClient, GraphNodeHttpClient } from "./graph";

export class GraphHttpClient extends EntityHttpClient<GraphDto> {
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
