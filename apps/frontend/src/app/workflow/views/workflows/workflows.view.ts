import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, lastValueFrom, Subscription } from "rxjs";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { isOrderValue, OrderValue } from "~/lib/common/endpoints";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import {
	ListSortColumns,
	ListSortOrderValueDefault
} from "~/lib/ng/lib/mat-list/list-sort.columns";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";
import { TranslationModule } from "~/lib/ng/lib/translation";

import {
	WorkflowListColumn,
	WorkflowListComponent,
	WorkflowListQuery
} from "../../components/workflow.list/workflow.list.component";

/** Query Params of this view */
const SORT_PARAM_SUFFIX = "sort.";
type SortParamSuffix = typeof SORT_PARAM_SUFFIX;
type SortParamKey = `${SortParamSuffix}${WorkflowListColumn}`;
type WorkflowsViewQueryParamSort = Partial<Record<SortParamKey, OrderValue>>;
// TODO: filter/paginate
type WorkflowsViewQueryParam = WorkflowsViewQueryParamSort;

@Component({
	standalone: true,
	styleUrls: ["./workflows.view.scss"],
	templateUrl: "./workflows.view.html",

	imports: [
		CommonModule,
		WorkflowListComponent,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		TranslationModule
	]
})
export class WorkflowsView implements OnInit, OnDestroy {
	protected readonly workflowsState$ = new RequestStateSubject(
		(query?: Parameters<WorkflowApiService["findAndCount"]>[0]) =>
			this.workflowApi.findAndCount(query)
	);

	protected readonly listQuery = signal<WorkflowListQuery>({});

	/**
	 * Used to avoid unnecessary request when it's only query params change from this same view.
	 */
	private readonly INTERNAL_NAVIGATION = {};

	private readonly subscription = new Subscription();

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param workflowApi injected
	 * @param router injected
	 * @param activatedRoute injected
	 * @param matDialog injected
	 */
	public constructor(
		private readonly workflowApi: WorkflowApiService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly matDialog: MatDialog
	) {}

	/** @inheritDoc */
	public ngOnInit() {
		this.subscription.add(
			this.activatedRoute.queryParams
				.pipe(
					filter(
						(_, i) =>
							// Take first event (loading view)
							i === 0 ||
							// Ignore internal navigation
							this.router.getCurrentNavigation()?.extras.state !==
								this.INTERNAL_NAVIGATION
					)
				)
				.subscribe(params => void this.doRequest(this.queryParamsToListQuery(params)))
		);
	}

	/** @inheritDoc */
	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/** @internal */
	protected workflowUrl({ _id }: Workflow) {
		return `/workflows/${_id}`;
	}

	/**
	 * Open the create dialog
	 */
	protected async openCreateDialog() {
		const { WorkflowCreateDialog } = await import(
			"../../dialogs/workflow-create.dialog/workflow-create.dialog"
		);

		await lastValueFrom(WorkflowCreateDialog.open(this.matDialog).afterClosed()).then(
			result => {
				if (result) {
					void this.router.navigateByUrl(this.workflowUrl(result.created));
				}
			}
		);
	}

	/**
	 * Handles the query change -> request data
	 *
	 * @param listQuery received by the event
	 */
	protected handleQueryChange(listQuery: WorkflowListQuery) {
		void this.doRequest(listQuery);
	}

	private doRequest(listQuery: WorkflowListQuery) {
		return this.workflowsState$
			.request(WorkflowListComponent.listQueryToApiQuery(listQuery))
			.then(
				() =>
					// Only update queryParams on success
					void this.router.navigate([], {
						queryParams: this.listQueryToQueryParams(listQuery),
						replaceUrl: true,
						state: this.INTERNAL_NAVIGATION
					})
			)
			.then(() => this.listQuery.set(listQuery))
			.catch(() => void 0);
	}

	// TODO: remove it from this component (lib?)
	private queryParamsToListQuery(queryParams: WorkflowsViewQueryParam): WorkflowListQuery {
		const sortQP = Object.entries(queryParams)
			.filter(([key, value]) => key.startsWith(SORT_PARAM_SUFFIX) && isOrderValue(value))
			.map(([key, value]) => [key.slice(SORT_PARAM_SUFFIX.length), value]) as Array<
			[WorkflowListColumn, ListSortOrderValueDefault]
		>;

		return {
			sort: new ListSortColumns<WorkflowListColumn>(
				sortQP.map(([column, direction]) => ({ column, direction }))
			)
		};
	}

	private listQueryToQueryParams(listQuery: WorkflowListQuery): WorkflowsViewQueryParam {
		// TODO: use a lib (dot-object like)
		const { sort = new ListSortColumns() } = listQuery;

		return Object.fromEntries(
			sort.columns.map(({ column, direction }) => [
				`${SORT_PARAM_SUFFIX}${column}` satisfies SortParamKey,
				direction
			])
		);
	}
}
