import {
	CreateOptions,
	EntityRepository,
	RequiredEntityData
} from "@mikro-orm/core";

import { WorkflowEntity } from "./workflow.entity";
import { GraphEntity } from "../graph/graph.entity";

/**
 * The repository to manage [workflows]{@link WorkflowEntity}.
 */
export class WorkflowRepository extends EntityRepository<WorkflowEntity> {
	/** @inheritDoc */
	public override create(
		data: RequiredEntityData<WorkflowEntity>,
		options?: CreateOptions
	): WorkflowEntity {
		if (data.__graph && data.graph) {
			return super.create(data, options);
		}

		if (data.__graph) {
			// The graph property is the persisted entity
			// 	-> create an empty entity with primary key (used for seeders)
			return super.create(
				{ ...data, graph: { _id: data.__graph } },
				options
			);
		}

		// On creation -> use an empty entity to automatically link it

		const graph = this.getEntityManager().create(
			GraphEntity,
			{} as unknown as never
		);
		return super.create({ ...data, graph }, options);
	}
}
