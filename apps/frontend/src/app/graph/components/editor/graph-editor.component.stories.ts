import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/angular";
import { Jsonify } from "type-fest";
import { GraphJSON } from "~/lib/common/app/graph/endpoints";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphEditorComponent } from "./graph-editor.component";
import { GraphComponent } from "../graph/graph.component";

const meta: Meta<GraphEditorComponent> = {
	component: GraphEditorComponent,
	title: "Graph/components/editor"
};
export default meta;
type Story = StoryObj<GraphEditorComponent>;

const {
	graph: { graphs }
} = jsonify(BASE_SEED);

const getGraphContent = (graph: GraphJSON): Pick<GraphComponent, "actions" | "arcs" | "nodes"> => {
	const { arcs: gArcs, nodes: gNodes } = JSON.parse(JSON.stringify(BASE_SEED.graph)) as Jsonify<
		typeof BASE_SEED.graph
	>;

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
		arcs,
		nodes
	};
};

export const Primary: Story = {
	args: {
		...getGraphContent(graphs[0]),
		readonly: false
	}
};
