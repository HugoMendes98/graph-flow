import { ClassicPreset } from "rete";
import { Jsonify } from "type-fest";
import { GraphNodeInputDto } from "~/lib/common/app/graph/dtos/node/input";

import { ReteNode } from "./rete.node";
import { ReteSocket } from "./rete.socket";

export class ReteInput extends ClassicPreset.Input<ReteSocket> {
	private static SOCKET = new ReteSocket("input");

	public constructor(
		public readonly node: ReteNode,
		public readonly input: Jsonify<GraphNodeInputDto>
	) {
		super(ReteInput.SOCKET);

		// TODO
	}
}
