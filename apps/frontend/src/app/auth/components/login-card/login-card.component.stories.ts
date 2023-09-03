import type { Meta, StoryObj } from "@storybook/angular";
import { expect } from "@storybook/jest";
import { userEvent, within } from "@storybook/testing-library";

import { LoginCardComponent } from "./login-card.component";

const meta: Meta<LoginCardComponent> = {
	component: LoginCardComponent,
	title: "LoginCardComponent"
};
export default meta;
type Story = StoryObj<LoginCardComponent>;

export const Primary: Story = {
	args: {}
};

export const TestButtonDisabled: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const txtEmail = canvasElement.querySelector("[name=email]")!;
		const txtPassword = canvasElement.querySelector("[name=password]")!;
		const btnLogin = canvas.getByRole<HTMLButtonElement>("button");

		expect(btnLogin.disabled).toBe(true);

		await userEvent.type(txtEmail, "abc@abc.com");
		expect(btnLogin.disabled).toBe(true);

		await userEvent.type(txtPassword, "12345678");
		expect(btnLogin.disabled).toBe(false);
	}
};
