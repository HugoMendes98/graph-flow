import type { Meta, StoryObj } from "@storybook/angular";

import { NodesView } from "./nodes.view";

const meta: Meta<NodesView> = {
	component: NodesView,
	title: "NodesView"
};
export default meta;
type Story = StoryObj<NodesView>;

export const Primary: Story = {
	args: {}
};
