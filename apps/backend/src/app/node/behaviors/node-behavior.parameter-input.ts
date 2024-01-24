import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { NodeBehaviorParameterInputDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeInputEntity } from "../input/node-input.entity";

/** @internal */
const fieldName = "__node_input" satisfies keyof DTO;
const type = NodeBehaviorType.PARAMETER_IN;

/**
 * Node behavior of `PARAMETER_IN` type
 */
@Entity({ discriminatorValue: type })
export class NodeBehaviorParameterInput
	extends NodeBehaviorBase<typeof type>
	implements DTO
{
	/** @inheritDoc */
	@Property({
		fieldName,
		formula: alias => `${alias}.${fieldName}`,
		persist: false
	})
	public readonly __node_input!: number;

	/** @inheritDoc */
	@OneToOne(() => NodeInputEntity, {
		fieldName,
		hidden: true,
		mapToPk: false,
		nullable: false,
		onUpdateIntegrity: "cascade",
		owner: true,
		persist: true,
		unique: true
	})
	public readonly nodeInput?: NodeInputEntity;
}
