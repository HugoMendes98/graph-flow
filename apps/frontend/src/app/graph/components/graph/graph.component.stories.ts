import { action } from "@storybook/addon-actions";
import { Meta, moduleMetadata } from "@storybook/angular";
import { Jsonify } from "type-fest";
import { GraphDto } from "~/lib/common/app/graph/dtos";
import { GraphNodeDto } from "~/lib/common/app/graph/dtos/node";
import { BASE_SEED } from "~/lib/common/seeds";

import { GraphComponent } from "./graph.component";

const getGraphContent = (graph: GraphDto): Pick<GraphComponent, "actions" | "arcs" | "nodes"> => {
	const { graphArcs, graphNodeInputs, graphNodeOutputs, graphNodes } = JSON.parse(
		JSON.stringify(BASE_SEED.graph)
	) as Jsonify<typeof BASE_SEED.graph>;

	const nodes = graphNodes
		.filter(({ __graph }) => __graph === graph._id)
		.map<Jsonify<GraphNodeDto>>(node => ({
			...node,
			inputs: graphNodeInputs.filter(({ __graph_node }) => __graph_node === node._id),
			outputs: graphNodeOutputs.filter(({ __graph_node }) => __graph_node === node._id)
		}));

	const arcs = graphArcs.filter(({ __from, __to }) =>
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

export const NodeFunctionDivision = {
	args: {
		...getGraphContent(BASE_SEED.graph.graphs[0]),
		readonly: false
	} satisfies Partial<GraphComponent>
} satisfies Meta<GraphComponent>;

export const WorkflowSQL = {
	args: {
		...getGraphContent(BASE_SEED.graph.graphs[1])
	} satisfies Partial<GraphComponent>
} satisfies Meta<GraphComponent>;

export default {
	component: GraphComponent,
	decorators: [
		moduleMetadata({ imports: [GraphComponent] }),
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
	render: args => ({ props: args }),
	title: "GraphComponent"
} satisfies Meta<GraphComponent>;
