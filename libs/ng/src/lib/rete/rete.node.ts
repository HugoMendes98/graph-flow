import { ClassicPreset } from "rete";
import { Node } from "~/lib/common/app/node/endpoints";

import { ReteInput } from "./rete.input";
import { ReteOutput } from "./rete.output";
import { ReteSocket } from "./rete.socket";

export class ReteNode extends ClassicPreset.Node<
	Record<string, ReteSocket>,
	Record<string, ReteSocket>
> {
	/** @inheritDoc */
	public override inputs!: Partial<Record<string, ReteInput>>;
	/** @inheritDoc */
	public override outputs!: Partial<Record<string, ReteOutput>>;

	public constructor(public readonly node: Node) {
		const { inputs, name, outputs } = node;
		super(name);

		for (const input of inputs) {
			this.addInput(input._id.toString(), new ReteInput(this, input));
		}

		for (const output of outputs) {
			this.addOutput(output._id.toString(), new ReteOutput(this, output));
		}
	}

	// TODO
}
