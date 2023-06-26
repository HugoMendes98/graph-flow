import { Meta, moduleMetadata } from "@storybook/angular";

import { HeaderComponent } from "./header.component";
import { MaterialModule } from "../../../material/material.module";

export const Primary = {
	args: {},
	render: (args: HeaderComponent) => ({
		props: args
	})
};

export default {
	component: HeaderComponent,
	decorators: [
		moduleMetadata({
			imports: [MaterialModule]
		})
	],
	title: "HeaderComponent"
} satisfies Meta<HeaderComponent>;
