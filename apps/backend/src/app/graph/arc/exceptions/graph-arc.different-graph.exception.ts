import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphException } from "../../exceptions";

/**
 * A {@link GraphException} to use when an arc tries to link elements from different arcs
 */
export class GraphArcDifferentGraphException extends GraphException {
	/**
	 * Creates the exception
	 *
	 * @param from id of the "node-output"
	 * @param to id of the "node-input"
	 */
	public constructor(from: EntityId, to: EntityId) {
		super(
			GraphErrorCode.ARC_DIFFERENT_GRAPH,
			`The node of the output ${from} and the node of the input ${to} are not on the same graph`
		);
	}
}
