import type { Meta, StoryObj } from "@storybook/angular";

import { NodesView } from "./nodes.view";

const meta: Meta<NodesView> = {
	component: NodesView,
	title: "Node/views/nodes"
};
export default meta;
type Story = StoryObj<NodesView>;

export const Primary: Story = {
	args: {}
};
