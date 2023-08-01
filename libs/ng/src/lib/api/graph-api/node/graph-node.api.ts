import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import {
	generateGraphNodesEndpoint,
	GraphNode,
	GraphNodeEndpoint
} from "~/lib/common/app/graph/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityApiService } from "../../_lib/entity-api";
import { ApiClient } from "../../api.client";

export class GraphNodeApi
	extends EntityApiService<GraphNode, GraphNodeCreateDto, GraphNodeUpdateDto>
	implements GraphNodeEndpoint
{
	/**
	 * @inheritDoc
	 */
	private readonly endpoint: string;

	public constructor(client: ApiClient, graphId: EntityId) {
		super(client);

		this.endpoint = generateGraphNodesEndpoint(graphId);
	}

	/**
	 * @inheritDoc
	 */
	public override getEntrypoint(): string {
		return this.endpoint;
	}
}
