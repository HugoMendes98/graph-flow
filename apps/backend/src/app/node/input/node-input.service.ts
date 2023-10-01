import { Injectable } from "@nestjs/common";
import { NodeInputCreateDto, NodeInputUpdateDto } from "~/lib/common/app/node/dtos/input";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeInputEntity } from "./node-input.entity";
import { NodeInputRepository } from "./node-input.repository";
import { EntityService } from "../../_lib/entity";

/**
 * To create node-inputs from the backend
 */
export interface NodeInputCreateEntity
	extends NodeInputCreateDto,
		Pick<NodeInputEntity, "__node" | "__ref"> {}

/**
 * Service to manages [node-inputs]{@link NodeInputEntity}
 *
 * Internal of NodeModule
 */
@Injectable()
export class NodeInputService extends EntityService<
	NodeInputEntity,
	NodeInputCreateEntity,
	NodeInputUpdateDto
> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: NodeInputRepository) {
		super(repository);
	}

	/**
	 * Finds a {@link NodeInputEntity} by its node.
	 *
	 * @param nodeId of the node
	 * @param inputId of the input
	 * @returns the found input
	 */
	public findByNodeId(nodeId: EntityId, inputId: EntityId) {
		return this.repository.findOneOrFail({ __node: inputId, _id: nodeId });
	}
}
