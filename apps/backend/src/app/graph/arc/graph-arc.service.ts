import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphArc } from "./graph-arc.entity";
import { GraphArcRepository } from "./graph-arc.repository";
import { EntityService } from "../../_lib/entity";

/**
 * Service to manages [graph-arcs]{@link GraphArc}.
 */
@Injectable()
export class GraphArcService extends EntityService<
	GraphArc,
	GraphArcCreateDto,
	Record<string, never>
> {
	public constructor(repository: GraphArcRepository) {
		super(repository);
	}

	/**
	 * Can not update an arc.
	 *
	 * @param _id ignored
	 * @param _toUpdate ignored
	 * @returns a Promise that rejects
	 */
	public override update(_id: EntityId, _toUpdate: Record<string, never>) {
		return Promise.reject(new MethodNotAllowedException("An arc can not be updated"));
	}
}
