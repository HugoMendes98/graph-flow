import { Injectable } from "@nestjs/common";
import {
	NodeInputCreateDto,
	NodeInputUpdateDto
} from "~/lib/common/app/node/dtos/input";
import { NodeErrorCode } from "~/lib/common/app/node/error-codes";
import {
	areNodeInputsReadonlyOnCreate,
	areNodeInputsReadonlyOnDelete,
	areNodeInputsReadonlyOnUpdate
} from "~/lib/common/app/node/io/input";
import { EntityId } from "~/lib/common/dtos/entity";
import { EntitiesToPopulate } from "~/lib/common/endpoints";

import { NodeInputReadonlyException } from "./exceptions";
import { NodeInputEntity } from "./node-input.entity";
import { NodeInputRepository } from "./node-input.repository";
import { EntityService, EntityServiceFindOptions } from "../../_lib/entity";
import { NodeEntity } from "../node.entity";

/**
 * To create node-inputs from the backend
 */
export interface NodeInputCreateEntity
	extends NodeInputCreateDto,
		Pick<NodeInputEntity, "__node" | "__ref"> {}

/**
 * This service is internal so fewer methods are visible from the exported service (composition approach).
 *
 * It avoids the mix with "pure" database logic (e.g. auto-update of reference) from user-input logic.
 */
class NodeInputEntityService extends EntityService<
	NodeInputEntity,
	NodeInputCreateEntity,
	NodeInputUpdateDto
> {
	/** @internal */
	public constructor(repository: NodeInputRepository) {
		super(repository);
	}
}

/**
 * Service to manages [node-inputs]{@link NodeInputEntity}
 *
 * Internal of NodeModule
 */
@Injectable()
export class NodeInputService {
	private readonly entityService: NodeInputEntityService;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: NodeInputRepository) {
		this.entityService = new NodeInputEntityService(repository);
	}

	/**
	 * Finds a {@link NodeInputEntity} by its node.
	 *
	 * @param nodeId of the node
	 * @param inputId of the input
	 * @param options Some options when loading an entity
	 * @returns the found input
	 */
	public findOneWithNodeId<P extends EntitiesToPopulate<NodeInputEntity>>(
		nodeId: number,
		inputId: number,
		options?: EntityServiceFindOptions<NodeInputEntity, P>
	) {
		return this.entityService.findOne(
			{ __node: nodeId, _id: inputId },
			options
		);
	}

	/**
	 * Creates an input for the given node,
	 * if the node inputs are writable.
	 *
	 * @param node to add the input to
	 * @param toCreate input to create
	 * @returns the created input
	 */
	public async createFromNode(
		node: NodeEntity,
		toCreate: NodeInputCreateDto
	): Promise<NodeInputEntity> {
		const type = node.behavior.type;
		if (areNodeInputsReadonlyOnCreate(type)) {
			throw new NodeInputReadonlyException(
				NodeErrorCode.INPUTS_READONLY_CREATE,
				type
			);
		}

		return this.entityService.create({
			...toCreate,
			__node: node._id,
			__ref: null
		});
	}

	/**
	 * Updates an input for the given node,
	 * if the node inputs are writable.
	 *
	 * @param node to update the input from
	 * @param id of the input to update
	 * @param toUpdate data to update
	 * @returns the updated input
	 */
	public async updateFromNode(
		node: NodeEntity,
		id: EntityId,
		toUpdate: NodeInputUpdateDto
	): Promise<NodeInputEntity> {
		await this.findOneWithNodeId(node._id, id);

		const type = node.behavior.type;
		if (areNodeInputsReadonlyOnUpdate(type)) {
			throw new NodeInputReadonlyException(
				NodeErrorCode.INPUTS_READONLY_UPDATE,
				type
			);
		}

		return this.entityService.update(id, toUpdate);
	}

	/**
	 * Deletes an input from the given node,
	 * if the node inputs are writable.
	 *
	 * @param node to update the input from
	 * @param id of the input to delete
	 * @returns the deleted input
	 */
	public async deleteFromNode(
		node: NodeEntity,
		id: EntityId
	): Promise<NodeInputEntity> {
		await this.findOneWithNodeId(node._id, id);

		const type = node.behavior.type;
		if (areNodeInputsReadonlyOnDelete(type)) {
			throw new NodeInputReadonlyException(
				NodeErrorCode.INPUTS_READONLY_DELETE,
				type
			);
		}

		return this.entityService.delete(id);
	}
}
