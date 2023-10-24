import type { Meta, StoryObj } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphNodePreviewComponent } from "./graph-node-preview.component";

const meta: Meta<GraphNodePreviewComponent> = {
	component: GraphNodePreviewComponent,
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
	title: "Graph/components/node-preview"
};
export default meta;
type Story = StoryObj<GraphNodePreviewComponent>;

const nodes = jsonify(BASE_SEED.graph.nodes);

const nodeCode = nodes[5];
const nodeFunction = nodes[7];
const nodeVariable = nodes[0];

export const NodeFunction: Story = {
	args: { node: nodeFunction }
};

export const NodeCode: Story = {
	args: { node: nodeCode }
};

export const NodeVariable: Story = {
	args: { node: nodeVariable }
};
