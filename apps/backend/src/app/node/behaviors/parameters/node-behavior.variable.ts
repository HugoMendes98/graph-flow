import { Entity, Property } from "@mikro-orm/core";
import { NodeBehaviorVariableDto } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeIoValue } from "~/lib/common/app/node/io";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";

/**
 * Node behavior of `VARIABLE` type
 */
@Entity({ discriminatorValue: NodeBehaviorType.VARIABLE })
export class NodeBehaviorVariable
	extends NodeBehaviorParameterBase<NodeBehaviorType.VARIABLE>
	implements NodeBehaviorVariableDto
{
	/** @inheritDoc */
	@Property({ type: Object })
	public value!: NodeIoValue;
}
