import type { Meta, StoryObj } from "@storybook/angular";

import { NodeSelectorComponent } from "./node-selector.component";

const meta: Meta<NodeSelectorComponent> = {
	component: NodeSelectorComponent,
	title: "NodeSelectorComponent"
};
export default meta;
type Story = StoryObj<NodeSelectorComponent>;

export const Primary: Story = {
	args: {}
};
