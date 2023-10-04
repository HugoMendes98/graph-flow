import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { delayWhen, of, timer } from "rxjs";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { ApiModule } from "~/lib/ng/lib/api";
import { GraphApiService } from "~/lib/ng/lib/api/graph-api/graph.api.service";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request-state.subject";
import { TranslationModule } from "~/lib/ng/lib/translation";

import {
	GraphActions,
	GraphComponent,
	NodeMoved
} from "../../../graph/components/graph/graph.component";

@Component({
	standalone: true,
	styleUrls: ["./workflow.view.scss"],
	templateUrl: "./workflow.view.html",

	imports: [
		ApiModule,
		CommonModule,
		GraphComponent,
		MatIconModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		TranslationModule
	]
})
export class WorkflowView {
	protected readonly requestState$ = new RequestStateSubject((workflowId: EntityId) =>
		this.service.findById(workflowId)
	);

	protected readonly requestState = toSignal(
		this.requestState$.pipe(
			// Stay a bit on the loading state to show the loading animations
			delayWhen(({ state }) => (state === "loading" ? of(0) : timer(500)))
		),
		{
			initialValue: this.requestState$.getValue()
		}
	);

	/**
	 * The id of the workflow to load
	 *
	 * @param id receive from the Route configuration
	 */
	@Input({ required: true, transform: (query: string) => +query })
	public set workflowId(id: EntityId) {
		void this.requestState$.request(id).catch(() => void 0);
	}

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param graphApi injected
	 */
	public constructor(
		private readonly service: WorkflowApiService,
		private readonly graphApi: GraphApiService
	) {}

	protected handleNodeMove(workflow: Workflow, nodeMoved: NodeMoved) {
		// TODO: this is temporary
		void this.graphApi
			.forNodes(workflow.__graph)
			.update(nodeMoved.node._id, { kind: { position: nodeMoved.current } });
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
