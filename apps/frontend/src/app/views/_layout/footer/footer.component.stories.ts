import { Meta } from "@storybook/angular";

import { FooterComponent } from "./footer.component";

export const Primary = {
	args: {},
	render: (args: FooterComponent) => ({
		props: args
	})
};

export default {
	component: FooterComponent,
	title: "FooterComponent"
} satisfies Meta<FooterComponent>;
