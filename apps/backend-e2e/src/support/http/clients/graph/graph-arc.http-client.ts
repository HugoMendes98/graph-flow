import { GraphArcDto } from "~/lib/common/dtos/graph/arc";

import { EntityHttpClient } from "../_lib/entity.http-client";

export class GraphArcHttpClient extends EntityHttpClient<GraphArcDto> {
	public constructor(private readonly endpoint: string) {
		super();
	}

	public override getEndpoint(): string {
		return this.endpoint;
	}
}
