import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { map, Observable } from "rxjs";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import {
	EntityFindQuery,
	EntityFindResult,
	EntityOrder
} from "~/lib/common/endpoints";
import { DotPath } from "~/lib/common/types";
import { MatCellDefDirective } from "~/lib/ng/lib/directives";
import { ListTableHeaderComponent } from "~/lib/ng/lib/mat-list/components/list-table-header/list-table-header.component";
import { ListSortColumns } from "~/lib/ng/lib/mat-list/list-sort.columns";
import { RequestStateWithSnapshot } from "~/lib/ng/lib/request-state";

import { GraphNodePreviewComponent } from "../../../graph/components/node-preview/graph-node-preview.component";

/**
 * The sortable columns for a node-list
 */
export const NODE_LIST_COLUMNS_SORTABLE = [
	"_id",
	"name",
	"behavior.type",
	"kind.active"
] as const satisfies ReadonlyArray<DotPath<NodeJSON>>;

/**
 * Additional columns for a node-list
 */
export const NODE_LIST_COLUMNS_ADDITIONAL = [
	"inputs/outputs",
	"actions.expansion"
] as const satisfies readonly string[];

/**
 * The columns for a node-list
 */
export const NODE_LIST_COLUMNS = [
	...NODE_LIST_COLUMNS_SORTABLE,
	...NODE_LIST_COLUMNS_ADDITIONAL
] as const;

/** Type of the node-list columns */
export type NodeListColumn = (typeof NODE_LIST_COLUMNS)[number];
export type NodeListColumnSortable =
	(typeof NODE_LIST_COLUMNS_SORTABLE)[number];

/** The sort type for a NodeList  */
export type NodeListSort = ListSortColumns<NodeListColumnSortable>;

/**
 * The query to display in the list.
 *
 * Only for visuals
 */
export interface NodeListQuery {
	sort?: NodeListSort;
	// TODO: filter, pagination
}

const getAnimation = () => {
	const closed = style({ height: 0, opacity: 0 });
	const timing = "150ms";
	return trigger("previewExpansion", [
		transition(":enter", [
			closed,
			animate(timing, style({ height: "*", opacity: 1 }))
		]),
		transition(":leave", [animate(timing, closed)])
	]);
};

@Component({
	selector: "app-node-list",
	standalone: true,
	styleUrls: ["./node.list.component.scss"],
	templateUrl: "./node.list.component.html",

	animations: [getAnimation()],
	imports: [
		CommonModule,
		MatCellDefDirective,
		MatTableModule,
		ListTableHeaderComponent,
		TranslateModule,
		MatIconModule,
		GraphNodePreviewComponent,
		MatButtonModule,
		RouterLink
	]
})
export class NodeListComponent implements OnChanges {
	public static listQueryToApiQuery(
		query: NodeListQuery
	): EntityFindQuery<NodeJSON> {
		const { sort = new ListSortColumns() } = query;

		return {
			order: sort.columns.map<EntityOrder<NodeJSON>>(
				({ column, direction }) => {
					switch (column) {
						case "behavior.type":
							return { behavior: { type: direction } };
						case "kind.active":
							return { kind: { active: direction } };
					}

					return { [column]: direction };
				}
			)
		};
	}
	// TODO: loading/error state

	/**
	 * The data to display
	 */
	@Input({ required: true })
	public state$!: Observable<
		RequestStateWithSnapshot<EntityFindResult<NodeJSON>, HttpErrorResponse>
	>;

	/**
	 * The columns to show
	 *
	 * @default All columns
	 */
	@Input()
	public columns: readonly NodeListColumn[] = NODE_LIST_COLUMNS.slice();

	/**
	 * Link to a node for the button inside the node preview.
	 *
	 * The button is removed when not set.
	 */
	@Input()
	public previewEditUrl?: (workflow: NodeJSON) => string;

	/**
	 * Custom query to show in the table.
	 *
	 * Only visual
	 */
	@Input()
	public query?: NodeListQuery;

	/**
	 * Behavior on row click:
	 * - null: Do nothing
	 * - "expansion": expand or collapse preview (even if the columns is not present)
	 * - function: Custom
	 *
	 * @default "expansion"
	 */
	@Input()
	public onRowClick?: "expansion" | ((node: NodeJSON) => void) | null;

	/**
	 * When something changes the query:
	 * - change order
	 * - filter
	 *
	 * !! It does not affect the state (from this component)
	 */
	@Output()
	public readonly queryChange = new EventEmitter<NodeListQuery>();

	/**
	 * The id of the node to expand
	 */
	@Input()
	public expanded?: number | null;
	/**
	 * When a row is expanded
	 */
	@Output()
	public readonly expandedChange = new EventEmitter<number | null>();

	/**
	 * All data columns for the table
	 */
	protected readonly COLUMNS_NODE = NODE_LIST_COLUMNS_SORTABLE;
	/**
	 * All additional columns for the table
	 */
	protected readonly COLUMNS_ADDITIONAL = NODE_LIST_COLUMNS_ADDITIONAL;
	/**
	 * Updates a table header direction
	 */
	protected readonly nextDirection =
		ListTableHeaderComponent.DEFAULT_NEXT_DIRECTION();

	/**
	 * The dataSource for the table
	 */
	protected dataSource$!: Observable<NodeJSON[]>;

	/**
	 * @returns If the expansion is enabled
	 */
	protected get isExpansionEnabled() {
		return (
			this.COLUMNS_ADDITIONAL.includes("actions.expansion") ||
			this.onRowClick === "expansion"
		);
	}

	/** @inheritDoc */
	public ngOnChanges(changes: SimpleChanges) {
		if (("state$" satisfies keyof this) in changes) {
			this.dataSource$ = this.state$.pipe(
				map(({ snapshot: { data } }) => data?.data ?? [])
			);
		}
	}

	/**
	 * Handles the click on a sortable header
	 *
	 * @param listSort the new listSort
	 */
	protected handleSort(listSort: NodeListSort) {
		this.queryChange.emit({ ...(this.query ?? {}), sort: listSort });
	}

	/**
	 * Handles the click on the row
	 *
	 * @param element of the row
	 */
	protected handleRowClick(element: NodeJSON) {
		const { onRowClick = "expansion" } = this;
		if (onRowClick === null) {
			return;
		}

		if (onRowClick === "expansion") {
			this.handleExpansion(element);
			return;
		}

		onRowClick(element);
	}

	/**
	 * Handles the expansion
	 *
	 * @param element of the row ro expand
	 */
	protected handleExpansion(element: NodeJSON) {
		this.expanded = this.expanded === element._id ? null : element._id;
		this.expandedChange.emit(this.expanded);
	}
}
