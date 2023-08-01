import { Injectable } from "@angular/core";
import { Jsonify } from "type-fest";
import { GraphDto } from "~/lib/common/app/graph/dtos";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/app/workflow/dtos";
import {
	Workflow,
	WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT,
	WorkflowEndpoint,
	WORKFLOWS_ENDPOINT_PREFIX
} from "~/lib/common/app/workflow/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the workflow API.
 */
@Injectable({
	providedIn: "root"
})
export class WorkflowApiService
	extends EntityApiService<Workflow, WorkflowCreateDto, WorkflowUpdateDto>
	implements WorkflowEndpoint
{
	public override getEntrypoint(): string {
		return WORKFLOWS_ENDPOINT_PREFIX;
	}

	/**
	 * @inheritDoc
	 */
	public lookForGraph(id: EntityId): Promise<Jsonify<GraphDto>> {
		return this.client.get(`${this.getEntrypoint()}/${id}${WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT}`);
	}
}
