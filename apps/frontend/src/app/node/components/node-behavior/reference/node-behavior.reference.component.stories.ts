import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorReferenceComponent } from "./node-behavior.reference.component";

const meta: Meta<NodeBehaviorReferenceComponent> = {
	component: NodeBehaviorReferenceComponent,
	title: "NodeBehaviorReferenceComponent"
};
export default meta;
type Story = StoryObj<NodeBehaviorReferenceComponent>;

export const Primary: Story = {
	args: {}
};
