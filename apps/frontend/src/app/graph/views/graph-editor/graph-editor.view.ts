import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Graph } from "~/lib/common/app/graph/endpoints";
import { ApiModule } from "~/lib/ng/lib/api";
import { GraphApiService } from "~/lib/ng/lib/api/graph-api";

import { GraphEditorComponent } from "../../components/editor/graph-editor.component";

/**
 * "Standalone" component for the [graph-editor]{@link GraphEditorComponent}.
 * This one does the necessary requests
 */
@Component({
	selector: "app-graph-editor-view",
	standalone: true,
	styleUrls: ["./graph-editor.view.scss"],
	templateUrl: "./graph-editor.view.html",

	imports: [ApiModule, CommonModule, GraphEditorComponent]
})
export class GraphEditorView {
	/** The graph to edit */
	@Input({ required: true })
	public graph!: Graph;

	/** Editor on readonly */
	@Input()
	public readonly?: boolean;

	/** @internal */
	public constructor(private readonly graphApiService: GraphApiService) {}
}
