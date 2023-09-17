import { Injectable } from "@angular/core";
import { Graph, GraphEndpoint, GRAPHS_ENDPOINT_PREFIX } from "~/lib/common/app/graph/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphArcApi } from "./arc/graph-arc.api";
import { GraphNodeApi } from "./node/graph-node.api";
import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the Graph API.
 */
@Injectable({ providedIn: "root" })
export class GraphApiService
	extends EntityApiService<Graph, never, never>
	implements GraphEndpoint
{
	/** @inheritDoc */
	public override getEntrypoint(): string {
		return GRAPHS_ENDPOINT_PREFIX;
	}

	/**
	 * @param graphId The id of the graph that containing arcs
	 * @returns the client to requests arcs
	 */
	public forArcs(graphId: EntityId) {
		return new GraphArcApi(this.client, graphId);
	}

	/**
	 * @param graphId The id of the graph that containing nodes
	 * @returns the client to requests nodes
	 */
	public forNodes(graphId: EntityId) {
		return new GraphNodeApi(this.client, graphId);
	}
}
