import { Entity, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { WorkflowDto } from "~/lib/common/dtos/workflow";

import { WorkflowRepository } from "./workflow.repository";
import { EntityBase } from "../_lib/entity";
import { ManyToOneFactory } from "../_lib/entity/decorators";
import { Graph } from "../graph/graph.entity";

const GraphProperty = ManyToOneFactory(() => Graph, {
	fieldName: "__graph" satisfies keyof WorkflowDto,
	onUpdateIntegrity: "cascade"
});

/**
 * The entity class to manage workflows
 */
@Entity({ customRepository: () => WorkflowRepository })
export class Workflow extends EntityBase implements DtoToEntity<WorkflowDto> {
	@GraphProperty({ foreign: false })
	public readonly __graph!: number;

	@Property({ unique: true })
	public name!: string;

	// ------- Relations -------

	@GraphProperty({ foreign: true })
	public readonly graph?: Graph;
}
