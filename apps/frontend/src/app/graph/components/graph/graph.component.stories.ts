import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/angular";
import { GraphDto } from "~/lib/common/app/graph/dtos";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphComponent } from "./graph.component";

const getGraphContent = (
	graph: GraphDto
): Pick<GraphComponent, "actions" | "graph"> => {
	const { arcs: gArcs, nodes: gNodes } = jsonify(BASE_SEED.graph);

	const nodes = gNodes.filter(
		({ kind }) =>
			kind.type === NodeKindType.VERTEX && kind.__graph === graph._id
	);

	const arcs = gArcs.filter(({ __from, __to }) =>
		nodes.some(
			({ inputs, outputs }) =>
				inputs.some(({ _id }) => _id === __to) ||
				outputs.some(({ _id }) => _id === __from)
		)
	);

	return {
		actions: {
			arc: {
				create: toCreate => {
					action("Arc to create")(toCreate);

					const arc = arcs[arcs.length - 1];
					return Promise.resolve({
						...arc,
						...toCreate,
						_id: arc._id * 10
					});
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
const meta: Meta<GraphComponent> = {
	component: GraphComponent,
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
	title: "Graph/components/Graph"
};
export default meta;
type Story = StoryObj<GraphComponent>;

export const NodeFunctionDivision: Story = {
	args: { ...getGraphContent(BASE_SEED.graph.graphs[0]), readonly: false }
};

export const WorkflowSQL: Story = {
	args: { ...getGraphContent(BASE_SEED.graph.graphs[1]) }
};
