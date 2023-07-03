import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";
import { WorkflowRelationsDto } from "~/app/common/dtos/workflow";

import { WorkflowRepository } from "./workflow.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";

/**
 * The entity class to manage workflows
 */
@Entity({ customRepository: () => WorkflowRepository })
export class Workflow extends EntityBase implements EntityWithRelations<WorkflowRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: WorkflowRepository;

	@Property({ unique: true })
	public name!: string;
}
