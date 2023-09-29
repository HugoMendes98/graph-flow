import type { Meta, StoryObj } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";

import { NodeView } from "./node.view";

const meta: Meta<NodeView> = {
	component: NodeView,
	title: "NodeView"
};
export default meta;
type Story = StoryObj<NodeView>;

const node = BASE_SEED.graph.nodes[0];

export const Primary: Story = {
	args: { nodeId: node._id }
};
