import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";
import { ApiModule } from "~/lib/ng/lib/api";
import { GraphApiService } from "~/lib/ng/lib/api/graph-api";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";

import {
	GraphEditorComponent,
	GraphEditorNodeToAdd
} from "../../components/editor/graph-editor.component";
import {
	GraphActions,
	GraphData,
	NodeMoved
} from "../../components/graph/graph.component";

/**
 * "Standalone" component for the [graph-editor]{@link GraphEditorComponent}.
 * This one does the necessary requests (and could be a standalone view)
 */
@Component({
	selector: "app-graph-editor-view",
	standalone: true,
	styleUrls: ["./graph-editor.view.scss"],
	templateUrl: "./graph-editor.view.html",

	imports: [ApiModule, CommonModule, GraphEditorComponent]
})
export class GraphEditorView implements OnInit {
	/** The graph to edit */
	@Input({ required: true })
	public graphId!: EntityId;

	/** Editor on readonly */
	@Input()
	public readonly?: boolean;

	/** The data of the graph */
	protected readonly data$ = new RequestStateSubject(async () => {
		const graph = await this.graphApi.findById(this.graphId);
		const { data: arcs } = await this.graphApi
			.forArcs(graph._id)
			.findAndCount();
		const { data: nodes } = await this.graphApi
			.forNodes(graph._id)
			.findAndCount();

		return { arcs, nodes } satisfies GraphData;
	});

	/** The possible nodes that can be added to the graph */
	protected readonly nodesState$ = new RequestStateSubject(() =>
		this.nodeApi.findAndCount({
			where: { kind: { active: true, type: NodeKindType.TEMPLATE } }
		})
	);

	protected readonly graphActions = {
		arc: {
			create: arc => this.graphApi.forArcs(this.graphId).create(arc),
			remove: arc =>
				this.graphApi.forArcs(this.graphId).delete(arc._id).then()
		}
	} as const satisfies GraphActions;

	/** @internal */
	public constructor(
		private readonly graphApi: GraphApiService,
		private readonly nodeApi: NodeApiService
	) {}

	/** @inheritDoc */
	public ngOnInit() {
		this.data$.request().catch(() => void 0);
		this.nodesState$.request().catch(() => void 0);
	}

	protected handleNodeMoved(nodeMoved: NodeMoved) {
		const { current, node } = nodeMoved;
		return this.graphApi
			.forNodes(this.graphId)
			.update(node._id, { kind: { position: current } });
	}

	/**
	 * Handles the addition of a new node in the graph
	 *
	 * @param nodeToAdd with the position
	 * @returns the all updated data graph
	 */
	protected handleNodeToAdd(nodeToAdd: GraphEditorNodeToAdd) {
		const { node, position } = nodeToAdd;

		return (
			this.graphApi
				.forNodes(this.graphId)
				.create({
					behavior: {
						__node: node._id,
						type: NodeBehaviorType.REFERENCE
					},
					kind: { position },
					name: `${node.name} (reference)`
				})
				// TODO: better? No need to reload everything
				.then(() => this.data$.request())
		);
	}
}
