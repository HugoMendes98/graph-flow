import { Meta, moduleMetadata, StoryObj } from "@storybook/angular";

import { ReteSocketComponent } from "./rete.socket.component";

const meta: Meta<ReteSocketComponent> = {
	component: ReteSocketComponent,
	decorators: [moduleMetadata({ imports: [ReteSocketComponent] })],
	title: "ReteSocketComponent"
};
export default meta;
type Story = StoryObj<ReteSocketComponent>;

export const SocketInput: Story = {
	args: {}
};

export const SocketOutput: Story = {
	args: {}
};
