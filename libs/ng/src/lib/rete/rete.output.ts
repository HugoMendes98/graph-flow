import { ClassicPreset } from "rete";
import { Jsonify } from "type-fest";
import { GraphNodeOutputDto } from "~/lib/common/app/graph/dtos/node/output";

import { ReteNode } from "./rete.node";
import { ReteSocket } from "./rete.socket";

export class ReteOutput extends ClassicPreset.Output<ReteSocket> {
	private static SOCKET = new ReteSocket("output");

	public constructor(
		public readonly node: ReteNode,
		public readonly output: Jsonify<GraphNodeOutputDto>
	) {
		super(ReteOutput.SOCKET);

		// TODO?
	}
}
