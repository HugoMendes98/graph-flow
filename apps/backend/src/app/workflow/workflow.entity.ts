import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { applyDecorators } from "@nestjs/common";
import { WorkflowDto } from "~/lib/common/app/workflow/dtos";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { WorkflowRepository } from "./workflow.repository";
import { EntityBase } from "../_lib/entity";
import { ManyToOneParams } from "../_lib/entity/decorators";
import { Graph } from "../graph/graph.entity";

const GraphProperty = ({ foreign }: Pick<ManyToOneParams, "foreign">) =>
	applyDecorators(
		OneToOne(() => Graph, {
			fieldName: "__graph" satisfies keyof WorkflowDto,
			hidden: foreign,
			mapToPk: !foreign,
			nullable: false,
			onDelete: "cascade",
			onUpdateIntegrity: "cascade",
			owner: true,
			persist: foreign,
			unique: true
		}) as never
	);

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
