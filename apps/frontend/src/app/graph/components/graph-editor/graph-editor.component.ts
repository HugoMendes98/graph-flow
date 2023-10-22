import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GraphArc } from "~/lib/common/app/graph/endpoints";
import { Node } from "~/lib/common/app/node/endpoints";

import { NodeSelectorComponent } from "./node-selector/node-selector.component";
import { GraphActions, GraphComponent, NodeMoved } from "../graph/graph.component";

@Component({
	selector: "app-graph-editor",
	standalone: true,
	styleUrls: ["./graph-editor.component.scss"],
	templateUrl: "./graph-editor.component.html",

	imports: [CommonModule, GraphComponent, NodeSelectorComponent]
})
export class GraphEditorComponent {
	/** The arcs of the graph */
	@Input({ required: true })
	public arcs!: readonly GraphArc[];

	/** The nodes (with their inputs/outputs) of the graph */
	@Input({ required: true })
	public nodes!: readonly Node[];

	/** Editor on readonly */
	@Input()
	public readonly?: boolean;

	/** The actions to update the graph */
	@Input()
	public actions: GraphActions = {};

	/** * When a node has been moved on the graph */
	@Output()
	public readonly nodeMoved = new EventEmitter<NodeMoved>();
}
