import type { Meta, StoryObj } from "@storybook/angular";
import { OrderValue } from "~/lib/common/endpoints";

import { ListTableHeaderComponent } from "./list-table-header.component";

type ComponentStory = ListTableHeaderComponent<1 | 2 | 3 | 4, OrderValue>;

const meta: Meta<ComponentStory> = {
	args: {},
	component: ListTableHeaderComponent,
	title: "ListTableHeaderComponent"
};
export default meta;
type Story = StoryObj<ComponentStory>;

export const Primary: Story = {
	args: {
		column: 1
	}
};
