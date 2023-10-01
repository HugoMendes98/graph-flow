import { CreateOptions, EntityRepository, Reference, RequiredEntityData } from "@mikro-orm/core";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeInputEntity } from "./input/node-input.entity";
import { NodeEntity } from "./node.entity";
import { NodeOutputEntity } from "./output/node-output.entity";
import { GraphEntity } from "../graph/graph.entity";

/**
 * The repository to manage [nodes]{@link NodeEntity}.
 */
export class NodeRepository extends EntityRepository<NodeEntity> {
	public override create(
		data: RequiredEntityData<NodeEntity>,
		options?: CreateOptions
	): NodeEntity {
		const { behavior } = data as NodeEntity;
		if (behavior.type === NodeBehaviorType.FUNCTION) {
			const graph = behavior.__graph
				? Reference.createFromPK(GraphEntity, behavior.__graph)
				: // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- It will create a graph in the ORM transaction
				  this.getEntityManager().create(GraphEntity, {} as GraphEntity);

			// @ts-expect-error - TS2589: Excessive type from the repository base code
			return super.create({ ...data, behavior: { ...behavior, graph } }, options);
		}

		if (behavior.type === NodeBehaviorType.PARAMETER_IN && behavior.__node_input) {
			const nodeInput = Reference.createFromPK(NodeInputEntity, behavior.__node_input);
			return super.create({ ...data, behavior: { ...behavior, nodeInput } }, options);
		}
		if (behavior.type === NodeBehaviorType.PARAMETER_OUT && behavior.__node_output) {
			const nodeOutput = Reference.createFromPK(NodeOutputEntity, behavior.__node_output);
			return super.create({ ...data, behavior: { ...behavior, nodeOutput } }, options);
		}

		return super.create(data, options);
	}
}
