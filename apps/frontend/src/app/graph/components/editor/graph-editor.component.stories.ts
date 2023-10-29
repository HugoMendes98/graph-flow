import { HttpErrorResponse } from "@angular/common/http";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/angular";
import { of } from "rxjs";
import { GraphJSON } from "~/lib/common/app/graph/endpoints";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";
import {
	getRequestStateSnapshot,
	RequestState,
	RequestStateWithSnapshot
} from "~/lib/ng/lib/request-state";

import { GraphEditorComponent } from "./graph-editor.component";
import { GraphComponent } from "../graph/graph.component";

const db = jsonify(BASE_SEED);
const { nodes } = db.graph;

const getGraphContent = (graph: GraphJSON): Pick<GraphComponent, "actions" | "graph"> => {
	const { arcs: gArcs, nodes: gNodes } = db.graph;

	const nodes = gNodes.filter(
		({ kind }) => kind.type === NodeKindType.VERTEX && kind.__graph === graph._id
	);

	const arcs = gArcs.filter(({ __from, __to }) =>
		nodes.some(
			({ inputs, outputs }) =>
				inputs.some(({ _id }) => _id === __to) || outputs.some(({ _id }) => _id === __from)
		)
	);

	return {
		actions: {
			arc: {
				create: toCreate => {
					action("Arc to create")(toCreate);

					const arc = arcs[arcs.length - 1];
					return Promise.resolve({ ...arc, ...toCreate, _id: arc._id * 10 });
				},
				remove: arc =>
					Promise.resolve().then(() => {
						action("Arc to remove")(arc);
					})
			}
		},
		graph: { arcs, nodes }
	};
};

const getRequestState = (
	state: RequestState<EntityFindResult<NodeJSON>>
): RequestStateWithSnapshot<EntityFindResult<NodeJSON>, HttpErrorResponse> => {
	return { ...state, snapshot: getRequestStateSnapshot(state) };
};

const nodes$ = of(
	getRequestState({
		data: {
			data: nodes,
			pagination: {
				range: { end: nodes.length, start: 0 },
				total: nodes.length
			}
		},
		error: false,
		state: "success"
	})
);

const meta: Meta<GraphEditorComponent> = {
	component: GraphEditorComponent,
	decorators: [
		(fn, ctx) => {
			const {
				canvasElement: { children, id, style }
			} = ctx;
			// Fullscreen when the story is show, reduced on docs page
			style.height = id === "storybook-root" ? "100vh" : "250px";

			setTimeout(() => {
				// To run once the DOM has been updated
				(children[0].children[0] as HTMLElement).style.height = "100%";
			}, 2);
			return fn();
		}
	],
	parameters: { layout: "fullscreen" },
	title: "Graph/components/editor"
};
export default meta;
type Story = StoryObj<GraphEditorComponent>;

export const Primary: Story = {
	args: { ...getGraphContent(db.graph.graphs[0]), nodes$, readonly: false }
};
