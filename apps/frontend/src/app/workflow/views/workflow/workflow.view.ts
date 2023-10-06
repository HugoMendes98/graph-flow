import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { delayWhen, of, Subscription, timer } from "rxjs";
import { EntityId } from "~/lib/common/dtos/entity";
import { ApiModule } from "~/lib/ng/lib/api";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import { RequestStateWrapperComponent } from "~/lib/ng/lib/request-state/components/request-state-wrapper/request-state-wrapper.component";
import { RequestStateSubject } from "~/lib/ng/lib/request-state/request-state.subject";
import { TranslationModule } from "~/lib/ng/lib/translation";

import { GraphComponent } from "../../../graph/components/graph/graph.component";

/**
 * Data to set on the Route configuration
 */
export interface WorkflowViewRouteData {
	/** Set the view on the graph tab */
	graph: boolean;
}

@Component({
	standalone: true,
	styleUrls: ["./workflow.view.scss"],
	templateUrl: "./workflow.view.html",

	imports: [
		ApiModule,
		CommonModule,
		GraphComponent,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		RouterModule,
		RequestStateWrapperComponent,
		TranslationModule
	]
})
export class WorkflowView implements OnInit, OnDestroy {
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

	@ViewChild(MatTabGroup, { static: true })
	private readonly matTab!: MatTabGroup;

	/** Used to avoid unnecessary request when it's only query params change from this same view. */
	private readonly subscription = new Subscription();

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
	 * @param activatedRoute injected
	 * @param router injected
	 */
	public constructor(
		private readonly service: WorkflowApiService,
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router
	) {}

	/** @inheritDoc */
	public ngOnInit() {
		this.subscription.add(
			this.activatedRoute.data.subscribe(data => {
				this.matTab.selectedIndex = (data as WorkflowViewRouteData).graph ? 1 : 0;
			})
		);

		this.matTab._handleClick = (_1, _2, index) => {
			const { selectedIndex } = this.matTab;
			if (selectedIndex === index) {
				// Same index? Do nothing
				return;
			}

			void this.router.navigate([selectedIndex ? "../" : "./graph"], {
				relativeTo: this.activatedRoute
			});
		};
	}

	/** @inheritDoc */
	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
