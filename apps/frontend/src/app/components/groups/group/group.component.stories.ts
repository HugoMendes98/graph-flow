import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata } from "@storybook/angular";

import { GroupComponent } from "./group.component";
import { MaterialModule } from "../../../material/material.module";

export const Primary = {
	args: {
		group: {
			_id: 1,

			__creator: null,
			_created_at: new Date(),
			_name: "group",
			_updated_at: new Date(),
			description: {},
			name: {}
		},
		position: "left",
		reverse: false
	} satisfies GroupComponent,
	render: (args: GroupComponent) => ({
		props: args
	})
};

export default {
	component: GroupComponent,
	decorators: [
		moduleMetadata({
			imports: [MaterialModule, RouterTestingModule]
		})
	],
	title: "GroupComponent"
} satisfies Meta<GroupComponent>;
