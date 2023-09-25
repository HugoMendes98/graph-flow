import { WorkflowDto } from "~/lib/common/app/workflow/dtos";
import { WORKFLOWS_ENDPOINT_PREFIX } from "~/lib/common/app/workflow/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class WorkflowHttpClient extends EntityHttpClient<WorkflowDto> {
	public override getEndpoint(): string {
		return WORKFLOWS_ENDPOINT_PREFIX;
	}
}
