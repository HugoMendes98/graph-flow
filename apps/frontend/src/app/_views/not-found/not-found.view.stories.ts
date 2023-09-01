import type { Meta, StoryObj } from "@storybook/angular";

import { NotFoundView } from "./not-found.view";

const meta: Meta<NotFoundView> = {
	component: NotFoundView,
	title: "NotFoundView"
};
export default meta;
type Story = StoryObj<NotFoundView>;

export const Primary: Story = {
	args: {}
};
