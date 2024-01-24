import { GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { GraphNodeCreateDto } from "~/lib/common/app/graph/dtos/node/graph-node.create.dto";
import {
	generateGraphNodesEndpoint,
	GraphNodeJSON
} from "~/lib/common/app/graph/endpoints";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityApiService } from "../../_lib/entity-api";
import { ApiClient } from "../../api.client";

export class GraphNodeApi<
	T extends GraphNodeJSON | NodeJSON = NodeJSON
> extends EntityApiService<T, GraphNodeCreateDto, GraphNodeUpdateDto> {
	/** @inheritDoc */
	private readonly endpoint: string;

	public constructor(client: ApiClient, graphId: EntityId) {
		super(client);

		this.endpoint = generateGraphNodesEndpoint(graphId);
	}

	/** @inheritDoc */
	public override getEntrypoint(): string {
		return this.endpoint;
	}
}
