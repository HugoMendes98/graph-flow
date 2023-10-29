import type { Meta, StoryObj } from "@storybook/angular";

import { NodeBehaviorReferenceComponent } from "./node-behavior.reference.component";

const meta: Meta<NodeBehaviorReferenceComponent> = {
	component: NodeBehaviorReferenceComponent,
	title: "Node/components/behavior/reference"
};
export default meta;
type Story = StoryObj<NodeBehaviorReferenceComponent>;

export const Primary: Story = {
	args: {}
};
