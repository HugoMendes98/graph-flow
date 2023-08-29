import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { ApiModule } from "~/lib/ng/lib/api";
import { GraphApiService } from "~/lib/ng/lib/api/graph-api/graph.api.service";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request.state.subject";

import {
	GraphActions,
	GraphComponent,
	GraphNodeMoved
} from "../../../graph/components/graph/graph.component";

@Component({
	standalone: true,
	styleUrls: ["./workflow.view.scss"],
	templateUrl: "./workflow.view.html",

	imports: [ApiModule, CommonModule, GraphComponent]
})
export class WorkflowView {
	protected readonly requestState$ = new RequestStateSubject((workflowId: EntityId) =>
		this.service
			.findById(workflowId)
			.then(workflow =>
				Promise.all([
					this.graphApi.forArcs(workflow.__graph).findAndCount(),
					this.graphApi.forNodes(workflow.__graph).findAndCount()
				]).then(([{ data: arcs }, { data: nodes }]) => ({ arcs, nodes, workflow }))
			)
	);

	@Input({ required: true, transform: (query: string) => +query })
	public set workflowId(id: EntityId) {
		void this.requestState$.request(id);
	}

	public constructor(
		private readonly service: WorkflowApiService,
		private readonly graphApi: GraphApiService
	) {}

	protected handleNodeMove(workflow: Workflow, nodeMoved: GraphNodeMoved) {
		// TODO: this is temporary
		void this.graphApi
			.forNodes(workflow.__graph)
			.update(nodeMoved.node._id, { position: nodeMoved.current });
	}

	protected getActions(workflow: Workflow): GraphActions {
		// TODO: this is temporary
		const { __graph } = workflow;
		const arcApi = this.graphApi.forArcs(__graph);

		return {
			arc: {
				create: toCreate => arcApi.create(toCreate),
				remove: arc => arcApi.delete(arc._id).then(() => void 0)
			}
		};
	}
}
