import { generateGraphNodesEndpoint } from "~/lib/common/app/graph/endpoints";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { Node } from "~/lib/common/app/node/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityApiService } from "../../_lib/entity-api";
import { ApiClient } from "../../api.client";

export class GraphNodeApi extends EntityApiService<Node, NodeCreateDto, NodeUpdateDto> {
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
