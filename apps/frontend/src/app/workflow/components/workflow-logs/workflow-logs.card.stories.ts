import type { Meta, StoryObj } from "@storybook/angular";

import { WorkflowLogsCard } from "./workflow-logs.card";

const meta: Meta<WorkflowLogsCard> = {
	component: WorkflowLogsCard,
	title: "WorkflowLogsCard"
};
export default meta;
type Story = StoryObj<WorkflowLogsCard>;

export const Primary: Story = {
	args: {}
};
