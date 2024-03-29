import type { Meta, StoryObj } from "@storybook/angular";
import { expect } from "@storybook/jest";
import { userEvent } from "@storybook/testing-library";

import { LoginCardComponent } from "./login-card.component";

const meta: Meta<LoginCardComponent> = {
	component: LoginCardComponent,
	title: "Auth/cards/login"
};
export default meta;
type Story = StoryObj<LoginCardComponent>;

export const Primary: Story = {
	args: {}
};

export const TestButtonDisabled: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const txtEmail = canvasElement.querySelector("[name=email]")!;
		const txtPassword = canvasElement.querySelector("[name=password]")!;
		const btnLogin = canvasElement.querySelector<HTMLButtonElement>(
			"button[type=submit]"
		)!;

		await expect(btnLogin.disabled).toBe(true);

		await userEvent.type(txtEmail, "abc@abc.com");
		await expect(btnLogin.disabled).toBe(true);

		await userEvent.type(txtPassword, "12345678");
		await expect(btnLogin.disabled).toBe(false);
	}
};
