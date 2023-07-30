import { Entity } from "@mikro-orm/core";
import { NodeBehaviorType, NodeBehaviorVariableDto } from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";

@Entity({ discriminatorValue: NodeBehaviorType.VARIABLE })
export class NodeBehaviorVariable
	extends NodeBehaviorParameterBase<NodeBehaviorType.VARIABLE>
	implements NodeBehaviorVariableDto {}
