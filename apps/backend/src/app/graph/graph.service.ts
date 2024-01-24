import { Injectable, MethodNotAllowedException } from "@nestjs/common";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphEntity } from "./graph.entity";
import { GraphRepository } from "./graph.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [graphs]{@link GraphEntity}.
 */
@Injectable()
export class GraphService extends EntityService<
	GraphEntity,
	Record<string, never>,
	unknown
> {
	// TODO: update types

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: GraphRepository) {
		super(repository);
	}

	/**
	 * It is not possible to graph directly.
	 * Use one of its parent to create one.
	 *
	 * @param _toCreate ignored
	 * @returns A promise that always reject
	 */
	public override async create(_toCreate: Record<string, never>) {
		return Promise.reject(
			new MethodNotAllowedException(
				`Can not create a graph directly. Create through a \`workflow\` or \`node-function\`.`
			)
		);
	}

	/**
	 * It is not possible to delete a graph directly.
	 * Use its parent to delete the graph.
	 *
	 * @param id Entity id to delete
	 * @returns A promise that always reject
	 */
	public override delete(id: EntityId): Promise<GraphEntity> {
		return Promise.reject(
			new MethodNotAllowedException(
				`Can not delete the graph ${id} directly. Delete through its \`workflow\` or \`node-function\`.`
			)
		);
	}

	/**
	 * Deletes a graph entity.
	 * To be called from a parent service (`workflow` or `node-function`).
	 *
	 * @param graph The graph to delete
	 * @returns the deleted graph
	 */
	public _deleteFromParent(graph: GraphEntity) {
		return this.deleteEntity(graph);
	}
}
