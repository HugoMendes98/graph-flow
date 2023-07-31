import { Meta, moduleMetadata } from "@storybook/angular";

import { HeaderComponent } from "./header.component";

export const Primary = {
	args: {},
	render: (args: HeaderComponent) => ({
		props: args
	})
};

export default {
	component: HeaderComponent,
	decorators: [moduleMetadata({ imports: [HeaderComponent] })],
	title: "HeaderComponent"
} satisfies Meta<HeaderComponent>;
