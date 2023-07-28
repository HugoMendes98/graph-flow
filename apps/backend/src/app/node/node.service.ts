import { Reference } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/dtos/node";

import { Node } from "./node.entity";
import { NodeRepository } from "./node.repository";
import { EntityService } from "../_lib/entity";
import { Category } from "../category/category.entity";

/**
 * Service to manages [nodes]{@link Node}.
 */
@Injectable()
export class NodeService extends EntityService<Node, NodeCreateDto, NodeUpdateDto> {
	public constructor(repository: NodeRepository) {
		super(repository);
	}

	/**
	 * Adds a category to a node.
	 * Nothing happens if the category is already linked to the given node
	 *
	 * @param nodeId The id of the node to add the category to
	 * @param categoryId The id of the category to add
	 * @returns The updated node
	 */
	public addCategory(nodeId: EntityId, categoryId: EntityId) {
		return this.findById(nodeId, { populate: ["categories"] }).then(async node => {
			node.categories.add(Reference.createFromPK(Category, categoryId));

			await this.repository.getEntityManager().persistAndFlush(node);
			return node;
		});
	}

	/**
	 * Removes a category from a node.
	 * Nothing happens if the category is does not exist or not linked
	 *
	 * @param nodeId The id of the node to remove the category from
	 * @param categoryId The id of the category to remove
	 * @returns The updated node
	 */
	public removeCategory(nodeId: EntityId, categoryId: EntityId) {
		return this.findById(nodeId, { populate: ["categories"] }).then(async node => {
			const categories = await node.categories.matching({
				where: { _id: { $eq: categoryId } }
			});

			if (categories.length === 0) {
				return node;
			}

			node.categories.remove(categories[0]);

			await this.repository.getEntityManager().persistAndFlush(node);
			return node;
		});
	}
}
