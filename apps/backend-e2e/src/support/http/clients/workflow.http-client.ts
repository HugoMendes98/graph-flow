import { WorkflowJSON, WORKFLOWS_ENDPOINT_PREFIX } from "~/lib/common/app/workflow/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class WorkflowHttpClient extends EntityHttpClient<WorkflowJSON> {
	public override getEndpoint(): string {
		return WORKFLOWS_ENDPOINT_PREFIX;
	}
}
