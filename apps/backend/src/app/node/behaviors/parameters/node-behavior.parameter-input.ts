import { Entity } from "@mikro-orm/core";
import {
	NodeBehaviorParameterInputDto,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeInputEntity } from "../../input";

/** @internal */
const InputProperty = ManyToOneFactory(() => NodeInputEntity, {
	fieldName: "__node_input" satisfies keyof NodeBehaviorParameterInputDto,
	onUpdateIntegrity: "cascade"
});

/**
 * Node behavior of `PARAMETER_IN` type
 */
@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_IN })
export class NodeBehaviorParameterInput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_IN>
	implements NodeBehaviorParameterInputDto
{
	/** @inheritDoc */
	@InputProperty({ foreign: false })
	public readonly __node_input!: number;

	@InputProperty({ foreign: true })
	public readonly nodeInput?: NodeInputEntity;
}
