import type { Meta, StoryObj } from "@storybook/angular";
import { Jsonify } from "type-fest";
import { BASE_SEED } from "~/lib/common/seeds";
import { ReteNode } from "~/lib/ng/lib/rete";

import { ReteNodeComponent } from "./rete.node.component";

const { nodes } = JSON.parse(JSON.stringify(BASE_SEED.graph)) as Jsonify<typeof BASE_SEED.graph>;

const nodeCode = nodes[5];
const nodeVariable = nodes[8];

const meta: Meta<ReteNodeComponent> = {
	component: ReteNodeComponent,
	title: "Graph/ReteJS/node"
};
export default meta;
type Story = StoryObj<ReteNodeComponent>;

export const NodeCode: Story = {
	args: {
		data: new ReteNode({
			...nodeCode,
			// FIXME
			inputs: [], // graphNodeInputs.filter(({ __graph_node }) => __graph_node === nodeCode._id),
			outputs: [] // graphNodeOutputs.filter(({ __graph_node }) => __graph_node === nodeCode._id)
		}),
		emit: () => void 0
	}
};

export const NodeVariable: Story = {
	args: {
		data: new ReteNode({
			...nodeVariable,
			// FIXME
			inputs: [], // graphNodeInputs.filter(({ __graph_node }) => __graph_node === nodeVariable._id),
			outputs: []
			// graphNodeOutputs.filter(
			// ({ __graph_node }) => __graph_node === nodeVariable._id
			// )
		}),
		emit: () => void 0
	}
};
