import { Entity, OneToOne } from "@mikro-orm/core";
import { applyDecorators } from "@nestjs/common";
import { NodeBehaviorFunctionDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";
import { ManyToOneParams } from "../../_lib/entity/decorators";
import { GraphEntity } from "../../graph/graph.entity";

const type = NodeBehaviorType.FUNCTION;

const GraphProperty = ({ foreign }: Pick<ManyToOneParams, "foreign">) =>
	applyDecorators(
		OneToOne(() => GraphEntity, {
			fieldName: "__graph" satisfies keyof DTO,
			hidden: foreign,
			mapToPk: !foreign,
			nullable: false,
			onDelete: "cascade",
			onUpdateIntegrity: "cascade",
			owner: true,
			persist: !foreign,
			unique: true
		}) as never
	);

@Entity({ discriminatorValue: type })
export class NodeBehaviorFunction extends NodeBehaviorBase<typeof type> implements DTO {
	/** @inheritDoc */
	@GraphProperty({ foreign: false })
	public readonly __graph!: number;

	@GraphProperty({ foreign: true })
	public readonly graph?: GraphEntity;
}
