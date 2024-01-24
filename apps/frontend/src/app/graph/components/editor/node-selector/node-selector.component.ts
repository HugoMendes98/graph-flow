import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Observable } from "rxjs";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { RequestStateWithSnapshot } from "~/lib/ng/lib/request-state";

import {
	NodeListColumn,
	NodeListComponent
} from "../../../../node/components/node.list/node.list.component";

/** The nodes to show in the selector */
export type NodeSelectorNodes = RequestStateWithSnapshot<
	EntityFindResult<NodeJSON>,
	HttpErrorResponse
>;

@Component({
	selector: "app-node-selector",
	standalone: true,
	styleUrls: ["./node-selector.component.scss"],
	templateUrl: "./node-selector.component.html",

	imports: [CommonModule, MatCardModule, NodeListComponent]
})
export class NodeSelectorComponent {
	/** The nodes that can be added to the graph */
	@Input({ required: true })
	public nodes$!: Observable<NodeSelectorNodes>;

	/** Emit the selected node */
	@Output()
	public readonly nodeSelected = new EventEmitter<NodeJSON>();

	/** Columns to show in the selector */
	protected readonly NODE_COLUMNS: readonly NodeListColumn[] = [
		"name",
		"actions.expansion"
	];

	/** @internal */
	protected handleNodeRowClick = (node: NodeJSON) =>
		this.nodeSelected.emit(node);
}
