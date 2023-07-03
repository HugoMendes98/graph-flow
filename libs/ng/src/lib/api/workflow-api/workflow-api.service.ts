import { Injectable } from "@angular/core";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/app/common/dtos/workflow";
import { Workflow, WorkflowEndpoint, WORKFLOWS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

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
}
