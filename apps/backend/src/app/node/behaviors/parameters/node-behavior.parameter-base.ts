import { Entity } from "@mikro-orm/core";
import {
	NodeBehaviorParameterBaseDto,
	NodeBehaviorParameterType
} from "~/lib/common/dtos/node/behaviors";

import { NODE_BEHAVIOR_ENTITY_OPTIONS, NodeBehaviorBase } from "../node-behavior.base";

@Entity({
	...NODE_BEHAVIOR_ENTITY_OPTIONS,
	abstract: true
})
export abstract class NodeBehaviorParameterBase<
		T extends NodeBehaviorParameterType = NodeBehaviorParameterType
	>
	extends NodeBehaviorBase<T>
	implements NodeBehaviorParameterBaseDto {}
