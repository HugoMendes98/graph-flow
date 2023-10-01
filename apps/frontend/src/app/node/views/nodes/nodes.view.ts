import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { filter, lastValueFrom, Subscription } from "rxjs";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { Node } from "~/lib/common/app/node/endpoints";
import { isOrderValue, OrderValue } from "~/lib/common/endpoints";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import {
	ListSortColumns,
	ListSortOrderValueDefault
} from "~/lib/ng/lib/mat-list/list-sort.columns";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";

import {
	NODE_LIST_COLUMNS_SORTABLE,
	NodeListColumnSortable,
	NodeListComponent,
	NodeListQuery
} from "../../components/node.list/node.list.component";

/** Query Params of this view */
const SORT_PARAM_SUFFIX = "sort.";
type SortParamSuffix = typeof SORT_PARAM_SUFFIX;
type SortParamKey = `${SortParamSuffix}${NodeListColumnSortable}`;
type NodesViewQueryParamSort = Partial<Record<SortParamKey, OrderValue>>;
// TODO: filter/paginate
type NodesViewQueryParam = NodesViewQueryParamSort;

@Component({
	standalone: true,
	styleUrls: ["./nodes.view.scss"],
	templateUrl: "./nodes.view.html",

	imports: [
		CommonModule,
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
		NodeListComponent,
		TranslateModule
	]
})
export class NodesView implements OnInit, OnDestroy {
	protected readonly nodesState$ = new RequestStateSubject(
		({ where = {}, ...query }: Parameters<WorkflowApiService["findAndCount"]>[0] = {}) =>
			this.nodeApi.findAndCount({
				...query,
				where: { $and: [{ kind: { type: NodeKindType.TEMPLATE } }, where] }
			})
	);

	protected readonly listQuery = signal<NodeListQuery>({});

	/**
	 * Used to avoid unnecessary request when it's only query params change from this same view.
	 */
	private readonly INTERNAL_NAVIGATION = {};
	private readonly subscription = new Subscription();

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param nodeApi injected
	 * @param router injected
	 * @param activatedRoute injected
	 * @param matDialog injected
	 */
	public constructor(
		private readonly nodeApi: NodeApiService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly matDialog: MatDialog
	) {}

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

	/** @internal */
	public ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/** @internal */
	protected nodeUrl({ _id }: Node) {
		return `/nodes/${_id}`;
	}

	protected async openCreateDialog() {
		const { NodeCreateDialog } = await import("../../dialogs/node-create/node-create.dialog");

		await lastValueFrom(
			NodeCreateDialog.open(this.matDialog, {
				initialData: { kind: { active: false, type: NodeKindType.TEMPLATE } }
			}).afterClosed()
		).then(result => {
			if (!result) {
				return;
			}

			void this.router.navigateByUrl(this.nodeUrl(result.created));
		});
	}

	/**
	 * Handles the query change -> request data
	 *
	 * @param listQuery received by the event
	 */
	protected handleQueryChange(listQuery: NodeListQuery) {
		void this.doRequest(listQuery);
	}

	private doRequest(listQuery: NodeListQuery) {
		return this.nodesState$
			.request(NodeListComponent.listQueryToApiQuery(listQuery))
			.then(
				() =>
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
	private queryParamsToListQuery(queryParams: NodesViewQueryParam): NodeListQuery {
		// TODO: use a lib (dot-object like)
		const sortQP = Object.entries(queryParams)
			.filter(([key, value]) => key.startsWith(SORT_PARAM_SUFFIX) && isOrderValue(value))
			.map(([key, value]) => [key.slice(SORT_PARAM_SUFFIX.length), value])
			.filter((element): element is [NodeListColumnSortable, ListSortOrderValueDefault] =>
				NODE_LIST_COLUMNS_SORTABLE.includes(element[0] as never)
			);

		return {
			sort: new ListSortColumns(sortQP.map(([column, direction]) => ({ column, direction })))
		};
	}

	private listQueryToQueryParams(listQuery: NodeListQuery): NodesViewQueryParam {
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
