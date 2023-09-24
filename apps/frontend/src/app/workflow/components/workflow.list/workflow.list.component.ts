import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { map, Observable } from "rxjs";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { MatCellDefDirective } from "~/lib/ng/lib/directives";
import { ListSortIconComponent } from "~/lib/ng/lib/mat-list/components/list-sort-icon/list-sort-icon.component";
import { ListTableHeaderComponent } from "~/lib/ng/lib/mat-list/components/list-table-header/list-table-header.component";
import { ListSortColumns } from "~/lib/ng/lib/mat-list/list-sort.columns";
import { RequestStateWithSnapshot } from "~/lib/ng/lib/request-state/request-state.snapshot";
import { TranslationModule } from "~/lib/ng/lib/translation";

/**
 * The data columns for a workflow-list
 */
export const WORKFLOW_LIST_COLUMNS = [
	"_id",
	"active",
	"name",
	"_created_at"
] as const satisfies ReadonlyArray<keyof Workflow>;

/** Type of the workflow-list columns */
export type WorkflowListColumn = (typeof WORKFLOW_LIST_COLUMNS)[number];

/** The sort type for a WorkflowList  */
export type WorkflowListSort = ListSortColumns<WorkflowListColumn>;

/**
 * The query to display in the list.
 *
 * Only for visuals
 */
export interface WorkflowListQuery {
	sort?: WorkflowListSort;
	// TODO: filter, pagination
}

@Component({
	selector: "app-workflow-list",
	standalone: true,
	styleUrls: ["./workflow.list.component.scss"],
	templateUrl: "./workflow.list.component.html",

	imports: [
		CommonModule,
		MatTableModule,
		MatCellDefDirective,
		TranslationModule,
		MatIconModule,
		MatBadgeModule,
		ListSortIconComponent,
		ListTableHeaderComponent
	]
})
export class WorkflowListComponent implements OnChanges {
	@Input({ required: true })
	public state$!: Observable<
		RequestStateWithSnapshot<EntityFindResult<Workflow>, HttpErrorResponse>
	>;

	/**
	 * The columns to show
	 *
	 * @default All columns
	 */
	@Input()
	public columns: readonly WorkflowListColumn[] = WORKFLOW_LIST_COLUMNS.slice();

	/**
	 * Custom query to show in the table.
	 *
	 * Only visual
	 */
	@Input()
	public query?: WorkflowListQuery;

	/**
	 * When something changes the query:
	 * - change order
	 * - filter
	 *
	 * !! It does not affect the state (from this component)
	 */
	@Output()
	public readonly queryChange = new EventEmitter<WorkflowListQuery>();

	/**
	 * The dataSource for the table
	 */
	protected dataSource$!: Observable<Workflow[]>;

	/**
	 * All columns for the table
	 */
	protected readonly COLUMNS_ALL = WORKFLOW_LIST_COLUMNS;

	/**
	 * Updates a table header direction
	 */
	protected readonly nextDirection = ListTableHeaderComponent.DEFAULT_NEXT_DIRECTION();

	/** @inheritDoc */
	public ngOnChanges(changes: SimpleChanges) {
		if (("state$" satisfies keyof WorkflowListComponent) in changes) {
			this.dataSource$ = this.state$.pipe(map(({ snapshot: { data } }) => data?.data ?? []));
		}
	}

	/**
	 * Handles the click on a sortable header
	 *
	 * @param listSort the new listSort
	 */
	protected handleSort(listSort: WorkflowListSort) {
		this.queryChange.emit({ ...(this.query ?? {}), sort: listSort });
	}
}
