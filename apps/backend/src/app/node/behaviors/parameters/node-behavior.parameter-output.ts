import { Entity } from "@mikro-orm/core";
import { NodeBehaviorParameterOutputDto, NodeBehaviorType } from "~/lib/common/dtos/node/behaviors";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { GraphNodeOutput } from "../../../graph/node/output";
import { NodeOutput } from "../../output";

const OutputProperty = ManyToOneFactory(() => NodeOutput, {
	fieldName: "__node_output" satisfies keyof NodeBehaviorParameterOutputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_OUT })
export class NodeBehaviorParameterOutput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_OUT>
	implements NodeBehaviorParameterOutputDto
{
	@OutputProperty({ foreign: false })
	public readonly __node_output!: number;

	@OutputProperty({ foreign: true })
	public readonly nodeOutput!: GraphNodeOutput;
}
