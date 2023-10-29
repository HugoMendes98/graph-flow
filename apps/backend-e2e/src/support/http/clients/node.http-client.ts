import { NodeJSON, NODES_ENDPOINT_PREFIX } from "~/lib/common/app/node/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class NodeHttpClient extends EntityHttpClient<NodeJSON> {
	public override getEndpoint(): string {
		return NODES_ENDPOINT_PREFIX;
	}
}
