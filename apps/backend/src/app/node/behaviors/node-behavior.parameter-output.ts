import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { NodeBehaviorParameterOutputDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeOutputEntity } from "../output/node-output.entity";

/** @internal */
const fieldName = "__node_output" satisfies keyof DTO;
const type = NodeBehaviorType.PARAMETER_OUT;

/**
 * Node behavior of `PARAMETER_OUT` type
 */
@Entity({ discriminatorValue: type })
export class NodeBehaviorParameterOutput
	extends NodeBehaviorBase<typeof type>
	implements DTO
{
	/** @inheritDoc */
	@Property({
		fieldName,
		formula: alias => `${alias}.${fieldName}`,
		persist: false
	})
	public readonly __node_output!: number;

	/** @inheritDoc */
	@OneToOne(() => NodeOutputEntity, {
		fieldName,
		hidden: true,
		mapToPk: false,
		nullable: false,
		onUpdateIntegrity: "cascade",
		owner: true,
		persist: true,
		unique: true
	})
	public readonly nodeOutput?: NodeOutputEntity;
}
