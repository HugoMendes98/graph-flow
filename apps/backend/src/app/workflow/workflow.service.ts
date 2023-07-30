import { Injectable } from "@nestjs/common";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/app/workflow/dtos";
import { EntityId } from "~/lib/common/dtos/entity";

import { Workflow } from "./workflow.entity";
import { WorkflowRepository } from "./workflow.repository";
import { EntityService } from "../_lib/entity";
import { GraphService } from "../graph/graph.service";

/**
 * Service to manages [workflows]{@link Workflow}.
 */
@Injectable()
export class WorkflowService extends EntityService<Workflow, WorkflowCreateDto, WorkflowUpdateDto> {
	public constructor(
		repository: WorkflowRepository,
		private readonly graphService: GraphService
	) {
		super(repository);
	}

	public override delete(id: EntityId): Promise<Workflow> {
		return this.findById(id, { populate: ["graph"] }).then(async entity => {
			// Cascade integrity -> deleting the graph deletes the workflow
			// TODO: Reverse the relation ? Remove the cascade and delete manually
			await this.graphService._deleteFromParent(entity.graph);
			return entity;
		});
	}
}
