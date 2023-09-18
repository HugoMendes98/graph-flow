import type { Meta, StoryObj } from "@storybook/angular";

import { NodeComponent } from "./node.component";

const meta: Meta<NodeComponent> = {
	component: NodeComponent,
	title: "NodeComponent"
};
export default meta;
type Story = StoryObj<NodeComponent>;

export const Primary: Story = {
	args: {}
};
