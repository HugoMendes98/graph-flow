import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorComponent } from "./node-behavior.component";

const meta: Meta<NodeBehaviorComponent> = {
	component: NodeBehaviorComponent,
	title: "Node/components/behavior"
};
export default meta;
type Story = StoryObj<NodeBehaviorComponent>;

export const Primary: Story = {
	args: {}
};
