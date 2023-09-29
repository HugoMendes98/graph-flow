import { RouterTestingModule } from "@angular/router/testing";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { HeaderComponent } from "./header.component";

const meta: Meta<HeaderComponent> = {
	component: HeaderComponent,
	decorators: [moduleMetadata({ imports: [RouterTestingModule] })],
	title: "HeaderComponent"
};
export default meta;
type Story = StoryObj<HeaderComponent>;

export const Primary: Story = {
	args: {}
};
