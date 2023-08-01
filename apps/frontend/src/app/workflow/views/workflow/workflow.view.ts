import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { EntityId } from "~/lib/common/dtos/entity";
import { ApiModule } from "~/lib/ng/lib/api";
import { GraphApiService } from "~/lib/ng/lib/api/graph-api/graph.api.service";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request.state.subject";

import { GraphComponent } from "../../../graph/components/graph/graph.component";

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
}
