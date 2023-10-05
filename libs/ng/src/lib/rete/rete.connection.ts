import { ClassicPreset } from "rete";
import { GraphArc } from "~/lib/common/app/graph/endpoints";

import { ReteInput } from "./rete.input";
import { ReteOutput } from "./rete.output";

export class ReteConnection extends ClassicPreset.Connection<
	ClassicPreset.Node,
	ClassicPreset.Node
> {
	public constructor(
		public readonly arc: GraphArc,
		output: ReteOutput,
		input: ReteInput
	) {
		super(output.node, output.output._id.toString(), input.node, input.input._id.toString());
	}

	// TODO?
}
