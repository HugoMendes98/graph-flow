import type { Meta, StoryObj } from "@storybook/angular";

import { HomeView } from "./home.view";

const meta: Meta<HomeView> = {
	component: HomeView,
	title: "HomeView"
};
export default meta;
type Story = StoryObj<HomeView>;

export const Primary: Story = {
	args: {}
};
