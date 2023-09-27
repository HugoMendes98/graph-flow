import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorTriggerComponent } from "./node-behavior.trigger.component";

const meta: Meta<NodeBehaviorTriggerComponent> = {
	component: NodeBehaviorTriggerComponent,
	title: "NodeBehaviorTriggerComponent"
};
export default meta;
type Story = StoryObj<NodeBehaviorTriggerComponent>;

export const Primary: Story = {
	args: {}
};
