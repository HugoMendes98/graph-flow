import { Injectable } from "@angular/core";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/dtos/node";
import { Node, NodeEndpoint, NODES_ENDPOINT_PREFIX } from "~/lib/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the node API.
 */
@Injectable({
	providedIn: "root"
})
export class NodeApiService
	extends EntityApiService<Node, NodeCreateDto, NodeUpdateDto>
	implements NodeEndpoint
{
	public override getEntrypoint(): string {
		return NODES_ENDPOINT_PREFIX;
	}
}
