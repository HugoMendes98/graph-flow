import { GraphNodeDto } from "~/lib/common/app/graph/dtos/node";

import { EntityHttpClient } from "../_lib/entity.http-client";

export class GraphNodeHttpClient extends EntityHttpClient<GraphNodeDto> {
	public constructor(private readonly endpoint: string) {
		super();
	}

	public override getEndpoint(): string {
		return this.endpoint;
	}
}
