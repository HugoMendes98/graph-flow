import { GraphArcJSON } from "~/lib/common/app/graph/endpoints";

import { EntityHttpClient } from "../_lib/entity.http-client";

export class GraphArcHttpClient extends EntityHttpClient<GraphArcJSON> {
	public constructor(private readonly endpoint: string) {
		super();
	}

	public override getEndpoint(): string {
		return this.endpoint;
	}
}
