import type { Meta, StoryObj } from "@storybook/angular";

import { NodeSelectorComponent } from "./node-selector.component";

const meta: Meta<NodeSelectorComponent> = {
	component: NodeSelectorComponent,
	title: "Graph/components/editor/node-preview"
};
export default meta;
type Story = StoryObj<NodeSelectorComponent>;

export const Primary: Story = {
	args: {}
};
