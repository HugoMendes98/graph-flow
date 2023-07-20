import { Injectable } from "@nestjs/common";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/dtos/workflow";

import { Workflow } from "./workflow.entity";
import { WorkflowRepository } from "./workflow.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [workflows]{@link Workflow}.
 */
@Injectable()
export class WorkflowService extends EntityService<Workflow, WorkflowCreateDto, WorkflowUpdateDto> {
	public constructor(repository: WorkflowRepository) {
		super(repository);
	}
}
