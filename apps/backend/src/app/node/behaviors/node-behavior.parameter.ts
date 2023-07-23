import { Entity } from "@mikro-orm/core";
import {
	NodeBehaviorVariableDto,
	NodeBehaviorType,
	NodeBehaviorParameterBaseDto,
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto
} from "~/lib/common/dtos/node/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.VARIABLE;

export abstract class NodeBehaviorParameterBase<
		T extends
			| NodeBehaviorType.PARAMETER_IN
			| NodeBehaviorType.PARAMETER_OUT
			| NodeBehaviorType.VARIABLE
	>
	extends NodeBehaviorBase<T>
	implements NodeBehaviorParameterBaseDto {}

@Entity({ discriminatorValue: NodeBehaviorType.VARIABLE })
export class NodeBehaviorVariable
	extends NodeBehaviorParameterBase<NodeBehaviorType.VARIABLE>
	implements NodeBehaviorVariableDto {}

@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_IN })
export class NodeBehaviorParameterInput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_IN>
	implements NodeBehaviorParameterInputDto
{
	public __input!: number;
}

@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_OUT })
export class NodeBehaviorParameterOutput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_OUT>
	implements NodeBehaviorParameterOutputDto
{
	public __output!: number;
}
