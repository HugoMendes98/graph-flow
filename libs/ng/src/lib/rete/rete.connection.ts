import { ClassicPreset } from "rete";

import { ReteInput } from "./rete.input";
import { ReteOutput } from "./rete.output";

export class ReteConnection extends ClassicPreset.Connection<
	ClassicPreset.Node,
	ClassicPreset.Node
> {
	public constructor(output: ReteOutput, input: ReteInput) {
		super(output.node, output.output._id.toString(), input.node, input.input._id.toString());
	}

	// TODO?
}
