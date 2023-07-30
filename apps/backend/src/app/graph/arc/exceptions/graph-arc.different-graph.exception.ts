import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphException } from "../../exceptions";

export class GraphArcDifferentGraphException extends GraphException {
	public constructor(from: EntityId, to: EntityId) {
		super(
			GraphErrorCode.ARC_DIFFERENT_GRAPH,
			`The node of the output ${from} and the node of the input ${to} are not on the same graph`
		);
	}
}
