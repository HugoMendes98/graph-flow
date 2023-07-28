import { CreateOptions, EntityRepository, RequiredEntityData } from "@mikro-orm/core";

import { Workflow } from "./workflow.entity";
import { Graph } from "../graph/graph.entity";

/**
 * The repository to manage [workflows]{@link Workflow}.
 */
export class WorkflowRepository extends EntityRepository<Workflow> {
	public override create(data: RequiredEntityData<Workflow>, options?: CreateOptions): Workflow {
		if (data.__graph && data.graph) {
			return super.create(data, options);
		}

		if (data.__graph) {
			// The graph property is the persisted entity
			// 	-> create an empty entity with primary key (used for seeders)
			return super.create({ ...data, graph: { _id: data.__graph } }, options);
		}

		// On creation -> use an empty entity to automatically link it
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Cast to satisfy TS
		const graph = this.getEntityManager().create(Graph, {} as Graph);
		return super.create({ ...data, graph }, options);
	}
}
