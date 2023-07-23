import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";
import { WorkflowRelationsDto } from "~/lib/common/dtos/workflow";

import { WorkflowRepository } from "./workflow.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";
import { ManyToOneFactory } from "../_lib/entity/decorators";
import { Graph } from "../graph/graph.entity";

const GraphProperty = ManyToOneFactory(() => Graph, {
	fieldName: "__graph" satisfies keyof WorkflowRelationsDto,
	onUpdateIntegrity: "cascade"
});

/**
 * The entity class to manage workflows
 */
@Entity({ customRepository: () => WorkflowRepository })
export class Workflow
	extends EntityBase
	implements EntityWithRelations<WorkflowRelationsDto, { graph: Graph }>
{
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: WorkflowRepository;

	@GraphProperty({ foreign: false })
	public readonly __graph!: number;
	@GraphProperty({ foreign: true })
	public graph?: Graph;

	@Property({ unique: true })
	public name!: string;
}
