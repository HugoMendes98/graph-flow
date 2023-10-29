import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorCodeComponent } from "./node-behavior.code.component";

const meta: Meta<NodeBehaviorCodeComponent> = {
	component: NodeBehaviorCodeComponent,
	title: "Node/components/behavior/code"
};
export default meta;
type Story = StoryObj<NodeBehaviorCodeComponent>;

export const Primary: Story = {
	args: {}
};
