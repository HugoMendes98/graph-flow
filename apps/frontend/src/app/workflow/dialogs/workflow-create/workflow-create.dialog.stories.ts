import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { WorkflowCreateDialog, WorkflowCreateDialogData } from "./workflow-create.dialog";

const meta: Meta<WorkflowCreateDialog> = {
	component: WorkflowCreateDialog,
	title: "Workflow/dialogs/create"
};
export default meta;
type Story = StoryObj<WorkflowCreateDialog>;

export const Primary: Story = {
	args: {},
	decorators: [
		moduleMetadata({
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: {} satisfies WorkflowCreateDialogData },
				{ provide: MatDialogRef, useValue: {} }
			]
		})
	]
};
