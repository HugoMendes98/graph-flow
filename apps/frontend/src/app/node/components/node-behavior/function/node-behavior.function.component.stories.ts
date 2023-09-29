import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorFunctionComponent } from "./node-behavior.function.component";

const meta: Meta<NodeBehaviorFunctionComponent> = {
	component: NodeBehaviorFunctionComponent,
	title: "NodeBehaviorFunctionComponent"
};
export default meta;
type Story = StoryObj<NodeBehaviorFunctionComponent>;

export const Primary: Story = {
	args: {}
};
