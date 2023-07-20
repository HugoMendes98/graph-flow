import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { GraphArcCreateDto, GraphArcUpdateDto } from "~/lib/common/dtos/graph/arc";

import { GraphArc } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService } from "../../_lib/entity";

/**
 * Service to manages [graph-arcs]{@link GraphArc}.
 */
@Injectable()
export class GraphArcService extends EntityService<GraphArc, GraphArcCreateDto, GraphArcUpdateDto> {
	public constructor(repository: GraphArcRepository) {
		super(repository);
	}

	/**
	 * Can not update an arc.
	 *
	 * @returns a Promise that rejects
	 */
	public override update(): Promise<GraphArc> {
		return Promise.reject(new MethodNotAllowedException());
	}
}
