import { Injectable } from "@nestjs/common";
import {
	NodeOutputCreateDto,
	NodeOutputUpdateDto
} from "~/lib/common/app/node/dtos/output";
import { NodeErrorCode } from "~/lib/common/app/node/error-codes";
import { areNodeOutputsReadonlyOnUpdate } from "~/lib/common/app/node/io/output";
import { EntityId } from "~/lib/common/dtos/entity";
import { EntitiesToPopulate } from "~/lib/common/endpoints";

import { NodeOutputReadonlyException } from "./exceptions";
import { NodeOutputEntity } from "./node-output.entity";
import { NodeOutputRepository } from "./node-output.repository";
import { EntityService, EntityServiceFindOptions } from "../../_lib/entity";
import { NodeEntity } from "../node.entity";

/**
 * This service is internal so fewer methods are visible from the exported service (composition approach).
 *
 * It avoids the mix with "pure" database logic (e.g. auto-update of reference) from user-input logic.
 */
class NodeOutputEntityService extends EntityService<
	NodeOutputEntity,
	NodeOutputCreateDto,
	NodeOutputUpdateDto
> {
	/** @internal */
	public constructor(repository: NodeOutputRepository) {
		super(repository);
	}
}

/**
 * Service to manages [node-outputs]{@link NodeOutputEntity}
 *
 * Internal of NodeModule
 */
@Injectable()
export class NodeOutputService {
	private readonly entityService: NodeOutputEntityService;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: NodeOutputRepository) {
		this.entityService = new NodeOutputEntityService(repository);
	}

	/**
	 * Finds a {@link NodeOutputEntity} by its node.
	 *
	 * @param nodeId of the node
	 * @param outputId of the output
	 * @param options Some options when loading an entity
	 * @returns the found output
	 */
	public findOneWithNodeId<P extends EntitiesToPopulate<NodeOutputEntity>>(
		nodeId: number,
		outputId: number,
		options?: EntityServiceFindOptions<NodeOutputEntity, P>
	) {
		return this.entityService.findOne(
			{ __node: nodeId, _id: outputId },
			options
		);
	}

	/**
	 * Updates an output for the given node,
	 * if the node outputs are writable.
	 *
	 * @param node to update the output from
	 * @param id of the output to update
	 * @param toUpdate data to update
	 * @returns the updated output
	 */
	public async updateFromNode(
		node: NodeEntity,
		id: EntityId,
		toUpdate: NodeOutputUpdateDto
	): Promise<NodeOutputEntity> {
		await this.findOneWithNodeId(node._id, id);

		const type = node.behavior.type;
		if (areNodeOutputsReadonlyOnUpdate(type)) {
			throw new NodeOutputReadonlyException(
				NodeErrorCode.OUTPUTS_READONLY_UPDATE,
				type
			);
		}

		return this.entityService.update(id, toUpdate);
	}
}
