import { Injectable } from "@angular/core";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import {
	NodeJSON,
	NodeEndpoint,
	NODES_ENDPOINT_PREFIX
} from "~/lib/common/app/node/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the node API.
 */
@Injectable({ providedIn: "root" })
export class NodeApiService
	extends EntityApiService<NodeJSON, NodeCreateDto, NodeUpdateDto>
	implements NodeEndpoint
{
	public override getEntrypoint(): string {
		return NODES_ENDPOINT_PREFIX;
	}
}
