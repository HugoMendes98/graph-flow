import type { Meta, StoryObj } from "@storybook/angular";

import { ListSortIconComponent } from "./list-sort-icon.component";

const meta: Meta<ListSortIconComponent> = {
	component: ListSortIconComponent,
	title: "ListSortIconComponent"
};
export default meta;
type Story = StoryObj<ListSortIconComponent>;

// FIXME: input setter

export const Primary: Story = {
	args: { direction: "asc", order: 1 }
};

export const NoBadge: Story = {
	args: { direction: "desc" }
};
