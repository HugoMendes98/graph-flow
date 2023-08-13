import { Meta, moduleMetadata } from "@storybook/angular";

import { ReteConnectionComponent } from "./rete.connection.component";

export const StraightLine = {
	args: {
		end: { x: 300, y: 200 },
		start: { x: 100, y: 200 },

		path: "M 100 200 C 200 200 200 200 300 200"
	}
} satisfies Meta<ReteConnectionComponent>;

export const Primary = {
	args: {
		end: { x: 344, y: 173 },
		start: { x: 231, y: 76 },

		path: "M 231 76 C 264.9 76 310.1 173 344 173"
	}
} satisfies Meta<ReteConnectionComponent>;

export default {
	component: ReteConnectionComponent,
	decorators: [moduleMetadata({ imports: [ReteConnectionComponent] })],
	title: "ReteConnectionComponent"
} satisfies Meta<ReteConnectionComponent>;
