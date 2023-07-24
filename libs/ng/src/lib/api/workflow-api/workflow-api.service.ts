import { Injectable } from "@angular/core";
import { Jsonify } from "type-fest";
import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { GraphDto } from "~/lib/common/dtos/graph";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/dtos/workflow";
import {
	Workflow,
	WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT,
	WorkflowEndpoint,
	WORKFLOWS_ENDPOINT_PREFIX
} from "~/lib/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the workflow API.
 */
@Injectable({
	providedIn: "root"
})
export class WorkflowApiService
	extends EntityApiService<Workflow, WorkflowCreateDto, WorkflowUpdateDto>
	implements WorkflowEndpoint<true>
{
	public override getEntrypoint(): string {
		return WORKFLOWS_ENDPOINT_PREFIX;
	}

	public lookForGraph(id: EntityId): Promise<Jsonify<GraphDto>> {
		return this.client.get(`${this.getEntrypoint()}/${id}${WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT}`);
	}
}
