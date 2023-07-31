import { Meta, moduleMetadata } from "@storybook/angular";

import { NotFoundView } from "./not-found.view";

export const Primary = {
	args: {},
	render: (args: NotFoundView) => ({
		props: args
	})
};

export default {
	component: NotFoundView,
	decorators: [moduleMetadata({ imports: [NotFoundView] })],
	title: "NotFoundView"
} satisfies Meta<NotFoundView>;
