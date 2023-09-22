import { Entity } from "@mikro-orm/core";
import { NodeBehaviorParameterBaseDto } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorParameterType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NODE_BEHAVIOR_ENTITY_OPTIONS, NodeBehaviorBase } from "../node-behavior.base";

@Entity({
	...NODE_BEHAVIOR_ENTITY_OPTIONS,
	abstract: true
})
export abstract class NodeBehaviorParameterBase<
		T extends NodeBehaviorParameterType = NodeBehaviorParameterType
	>
	extends NodeBehaviorBase<T>
	implements NodeBehaviorParameterBaseDto<T> {}
