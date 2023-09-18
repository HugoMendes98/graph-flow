import type { Meta, StoryObj } from "@storybook/angular";

import { WorkflowsView } from "./workflows.view";

const meta: Meta<WorkflowsView> = {
	component: WorkflowsView,
	title: "WorkflowsView"
};
export default meta;
type Story = StoryObj<WorkflowsView>;

export const Primary: Story = {
	args: {}
};
