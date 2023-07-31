import { Meta, moduleMetadata } from "@storybook/angular";

import { AppComponent } from "./app.component";

export const Primary = {
	args: {},
	render: (args: AppComponent) => ({
		props: args
	})
};

export default {
	component: AppComponent,
	decorators: [moduleMetadata({ imports: [AppComponent] })],
	title: "AppComponent"
} satisfies Meta<AppComponent>;
