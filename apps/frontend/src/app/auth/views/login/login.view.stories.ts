import type { Meta, StoryObj } from "@storybook/angular";
import { componentWrapperDecorator } from "@storybook/angular";

import { LoginView } from "./login.view";

const meta: Meta<LoginView> = {
	component: LoginView,
	decorators: [
		componentWrapperDecorator(
			story =>
				`<div class="flex flex-1 flex-col" style="min-height: 500px">${story}</div>`
		)
	],
	title: "Auth/views/Login"
};
export default meta;
type Story = StoryObj<LoginView>;

export const Primary: Story = {
	args: {
		redirectUrl: ""
	}
};
