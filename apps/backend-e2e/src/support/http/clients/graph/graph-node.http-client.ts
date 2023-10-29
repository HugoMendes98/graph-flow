import { GraphNodeJSON } from "~/lib/common/app/graph/endpoints";

import { EntityHttpClient } from "../_lib/entity.http-client";

export class GraphNodeHttpClient extends EntityHttpClient<GraphNodeJSON> {
	public constructor(private readonly endpoint: string) {
		super();
	}

	public override getEndpoint(): string {
		return this.endpoint;
	}
}
