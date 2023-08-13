import { ClassicPreset } from "rete";
import { GraphNode } from "~/lib/common/app/graph/endpoints";

import { ReteInput } from "./rete.input";
import { ReteOutput } from "./rete.output";
import { ReteSocket } from "./rete.socket";

// namespace ClassicPreset {
// 	export class Node {}
// }

export class ReteNode extends ClassicPreset.Node<
	Record<string, ReteSocket>,
	Record<string, ReteSocket>
> {
	/**
	 * @inheritDoc
	 */
	public override inputs!: Partial<Record<string, ReteInput>>;
	/**
	 * @inheritDoc
	 */
	public override outputs!: Partial<Record<string, ReteOutput>>;

	public constructor(graphNode: GraphNode) {
		const { inputs, name, outputs } = graphNode;
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
