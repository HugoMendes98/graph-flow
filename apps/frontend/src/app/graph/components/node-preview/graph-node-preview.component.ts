import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeJSON } from "~/lib/common/app/node/endpoints";

import { GraphComponent } from "../graph/graph.component";

@Component({
	selector: "app-graph-node-preview",
	standalone: true,
	styleUrls: ["./graph-node-preview.component.scss"],
	templateUrl: "./graph-node-preview.component.html",

	imports: [CommonModule, GraphComponent]
})
export class GraphNodePreviewComponent {
	/**
	 * The real node
	 */
	protected _node!: NodeJSON;

	/**
	 * The node to preview
	 */
	@Input({ required: true })
	public set node(node: NodeJSON) {
		this._node = {
			...node,
			kind: {
				__graph: 0,
				position: { x: 10, y: 10 },
				type: NodeKindType.VERTEX
			}
		};
	}
}
