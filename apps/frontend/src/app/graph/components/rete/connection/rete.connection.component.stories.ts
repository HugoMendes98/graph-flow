import type { Meta, StoryObj } from "@storybook/angular";

import { ReteConnectionComponent } from "./rete.connection.component";

const meta: Meta<ReteConnectionComponent> = {
	component: ReteConnectionComponent,
	title: "ReteConnectionComponent"
};
export default meta;
type Story = StoryObj<ReteConnectionComponent>;

export const Primary: Story = {
	args: {
		end: { x: 344, y: 173 },
		start: { x: 231, y: 76 },

		path: "M 231 76 C 264.9 76 310.1 173 344 173"
	}
};

export const StraightLine: Story = {
	args: {
		end: { x: 300, y: 200 },
		start: { x: 100, y: 200 },

		path: "M 100 200 C 200 200 200 200 300 200"
	}
};
