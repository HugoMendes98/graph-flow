import { CommonModule } from "@angular/common";
import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { PositionDto } from "~/lib/common/app/node/dtos/position.dto";
import { NodeJSON } from "~/lib/common/app/node/endpoints";

import {
	NodeSelectorComponent,
	NodeSelectorNodes
} from "./node-selector/node-selector.component";
import {
	GraphActions,
	GraphComponent,
	GraphData,
	NodeMoved
} from "../graph/graph.component";

export interface GraphEditorNodeToAdd {
	/** Node-template to add */
	node: NodeJSON;
	/** Position */
	position: PositionDto;
}

@Component({
	selector: "app-graph-editor",
	standalone: true,
	styleUrls: ["./graph-editor.component.scss"],
	templateUrl: "./graph-editor.component.html",

	imports: [CommonModule, GraphComponent, NodeSelectorComponent]
})
export class GraphEditorComponent {
	/** The graph data to view */
	@Input({ required: true })
	public graph!: GraphData;

	/** Editor on readonly */
	@Input()
	public readonly?: boolean;

	/** The actions to update the graph */
	@Input()
	public actions: GraphActions = {};

	/** The nodes that can be added to the graph */
	@Input({ required: true })
	public nodes$!: Observable<NodeSelectorNodes>;

	/** When a node has been moved on the graph */
	@Output()
	public readonly nodeMoved = new EventEmitter<NodeMoved>();

	/** Emits a node to add */
	@Output()
	public readonly nodeToAdd = new EventEmitter<GraphEditorNodeToAdd>();

	@ViewChild(GraphComponent, { static: true })
	private readonly graphComponent!: GraphComponent;

	/**
	 * Handles the node selected from the {@link NodeSelectorComponent}
	 *
	 * @param node that was selected
	 */
	protected handleNodeSelected(node: NodeJSON) {
		this.nodeToAdd.emit({
			node,
			position: this.graphComponent.getCurrentViewPort().middle
		});
	}
}
