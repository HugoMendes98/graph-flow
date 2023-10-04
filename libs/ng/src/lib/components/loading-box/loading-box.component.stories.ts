import type { Meta, StoryObj } from "@storybook/angular";

import { LoadingBoxComponent } from "./loading-box.component";

const meta: Meta<LoadingBoxComponent> = {
	component: LoadingBoxComponent,
	title: "LoadingBoxComponent"
};
export default meta;
type Story = StoryObj<LoadingBoxComponent>;

export const Primary: Story = {
	args: {
		backgroundColor: "var(--mat-stepper-line-color)",
		color: "accent",
		diameter: 96
	}
};

export const Another: Story = {
	args: {
		backgroundColor: "yellow",
		color: "primary",
		diameter: 40
	}
};
