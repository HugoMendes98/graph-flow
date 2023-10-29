import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorVariableComponent } from "./node-behavior.variable.component";

const meta: Meta<NodeBehaviorVariableComponent> = {
	component: NodeBehaviorVariableComponent,
	title: "Node/components/behavior/variable"
};
export default meta;
type Story = StoryObj<NodeBehaviorVariableComponent>;

export const Primary: Story = {
	args: {}
};
