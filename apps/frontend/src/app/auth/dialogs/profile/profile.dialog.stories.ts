import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";

import { ProfileDialog, ProfileDialogData } from "./profile.dialog";

const meta: Meta<ProfileDialog> = {
	component: ProfileDialog,
	title: "Auth/dialogs/profile"
};
export default meta;
type Story = StoryObj<ProfileDialog>;

export const Primary: Story = {
	args: {},
	decorators: [
		moduleMetadata({
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						user: BASE_SEED.users[0]
					} satisfies ProfileDialogData
				}
			]
		})
	]
};
