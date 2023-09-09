import { Entity } from "@mikro-orm/core";
import {
	NodeBehaviorParameterInputDto,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeInput } from "../../input";

const InputProperty = ManyToOneFactory(() => NodeInput, {
	fieldName: "__node_input" satisfies keyof NodeBehaviorParameterInputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_IN })
export class NodeBehaviorParameterInput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_IN>
	implements NodeBehaviorParameterInputDto
{
	/**
	 * @inheritDoc
	 */
	@InputProperty({ foreign: false })
	public readonly __node_input!: number;

	@InputProperty({ foreign: true })
	public readonly nodeInput?: NodeInput;
}
