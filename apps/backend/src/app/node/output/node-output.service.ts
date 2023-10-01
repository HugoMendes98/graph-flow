import { Injectable } from "@nestjs/common";
import { NodeOutputCreateDto, NodeOutputUpdateDto } from "~/lib/common/app/node/dtos/output";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeOutputEntity } from "./node-output.entity";
import { NodeOutputRepository } from "./node-output.repository";
import { EntityService } from "../../_lib/entity";

/**
 * Service to manages [node-outputs]{@link NodeOutputEntity}
 *
 * Internal of NodeModule
 */
@Injectable()
export class NodeOutputService extends EntityService<
	NodeOutputEntity,
	NodeOutputCreateDto,
	NodeOutputUpdateDto
> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: NodeOutputRepository) {
		super(repository);
	}

	/**
	 * Finds a {@link NodeOutputEntity} by its node.
	 *
	 * @param nodeId of the node
	 * @param outputId of the output
	 * @returns the found output
	 */
	public findByNodeId(nodeId: EntityId, outputId: EntityId) {
		return this.repository.findOneOrFail({ __node: outputId, _id: nodeId });
	}
}
