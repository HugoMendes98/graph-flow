import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";

import { NodeCreateDialog, NodeCreateDialogData } from "./node-create.dialog";

const meta: Meta<NodeCreateDialog> = {
	component: NodeCreateDialog,
	title: "Node/dialogs/create"
};
export default meta;
type Story = StoryObj<NodeCreateDialog>;

export const Primary: Story = {
	args: {},
	decorators: [
		moduleMetadata({
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						initialData: {
							kind: { active: false, type: NodeKindType.TEMPLATE }
						}
					} satisfies NodeCreateDialogData
				},
				{ provide: MatDialogRef, useValue: {} }
			]
		})
	]
};
