import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import {
	generateGraphArcsEndpoint,
	GraphArc,
	GraphArcEndpoint
} from "~/lib/common/app/graph/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityApiService } from "../../_lib/entity-api";
import { ApiClient } from "../../api.client";

export class GraphArcApi
	extends EntityApiService<GraphArc, GraphArcCreateDto, never>
	implements GraphArcEndpoint
{
	/**
	 * @inheritDoc
	 */
	private readonly endpoint: string;

	public constructor(client: ApiClient, graphId: EntityId) {
		super(client);

		this.endpoint = generateGraphArcsEndpoint(graphId);
	}

	/**
	 * @inheritDoc
	 */
	public override getEntrypoint(): string {
		return this.endpoint;
	}
}
