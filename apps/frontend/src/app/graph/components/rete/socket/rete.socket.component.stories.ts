import { Meta, moduleMetadata } from "@storybook/angular";

import { ReteSocketComponent } from "./rete.socket.component";

export const SocketInput = {
	args: {}
} satisfies Meta<ReteSocketComponent>;

export const SocketOutput = {
	args: {}
} satisfies Meta<ReteSocketComponent>;

export default {
	component: ReteSocketComponent,
	decorators: [moduleMetadata({ imports: [ReteSocketComponent] })],
	title: "ReteSocketComponent"
} satisfies Meta<ReteSocketComponent>;
