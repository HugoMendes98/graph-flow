import { Meta, moduleMetadata } from "@storybook/angular";
import { Jsonify } from "type-fest";
import { BASE_SEED } from "~/lib/common/seeds";
import { ReteNode } from "~/lib/ng/lib/rete";

import { ReteNodeComponent } from "./rete.node.component";

const { graphNodeInputs, graphNodeOutputs, graphNodes } = JSON.parse(
	JSON.stringify(BASE_SEED.graph)
) as Jsonify<typeof BASE_SEED.graph>;

const nodeCode = graphNodes[0];
const nodeVariable = graphNodes[8];

export const NodeCode = {
	args: {
		data: new ReteNode({
			...nodeCode,
			inputs: graphNodeInputs.filter(({ __graph_node }) => __graph_node === nodeCode._id),
			outputs: graphNodeOutputs.filter(({ __graph_node }) => __graph_node === nodeCode._id)
		}),
		emit: () => void 0
	}
} satisfies Meta<ReteNodeComponent>;

export const NodeVariable = {
	args: {
		data: new ReteNode({
			...nodeVariable,
			inputs: graphNodeInputs.filter(({ __graph_node }) => __graph_node === nodeVariable._id),
			outputs: graphNodeOutputs.filter(
				({ __graph_node }) => __graph_node === nodeVariable._id
			)
		}),
		emit: () => void 0
	}
} satisfies Meta<ReteNodeComponent>;

export default {
	component: ReteNodeComponent,
	decorators: [moduleMetadata({ imports: [ReteNodeComponent] })],
	title: "ReteNodeComponent"
} satisfies Meta<ReteNodeComponent>;
