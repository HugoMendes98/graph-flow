import { Meta, moduleMetadata } from "@storybook/angular";

import { WorkflowView } from "./workflow.view";

export const Primary = {
	args: {},
	render: (args: WorkflowView) => ({
		props: args
	})
} satisfies Meta<WorkflowView>;

export default {
	component: WorkflowView,
	decorators: [moduleMetadata({ imports: [WorkflowView] })],
	title: "Workflow/views/workflow"
} satisfies Meta<WorkflowView>;
