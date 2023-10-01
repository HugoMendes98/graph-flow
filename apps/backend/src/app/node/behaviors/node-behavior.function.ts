import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { NodeBehaviorFunctionDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";
import { GraphEntity } from "../../graph/graph.entity";

/** @internal */
const fieldName = "__graph" satisfies keyof DTO;
const type = NodeBehaviorType.FUNCTION;

@Entity({ discriminatorValue: type })
export class NodeBehaviorFunction extends NodeBehaviorBase<typeof type> implements DTO {
	/** @inheritDoc */
	@Property({ fieldName, formula: alias => `${alias}.${fieldName}`, persist: false })
	public readonly __graph!: number;

	@OneToOne(() => GraphEntity, {
		fieldName,
		hidden: true,
		mapToPk: false,
		nullable: false,
		onDelete: "cascade",
		onUpdateIntegrity: "cascade",
		owner: true,
		persist: true,
		unique: true
	})
	public readonly graph?: GraphEntity;
}
