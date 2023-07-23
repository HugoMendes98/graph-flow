import { Type } from "@nestjs/common";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorCode } from "./node-behavior.code";
import { NodeBehaviorFunction } from "./node-behavior.function";
import { NODE_BEHAVIOR_PARAMETER_ENTITIES } from "./node-behavior.parameter";
import { NodeBehaviorTrigger } from "./node-behavior.trigger";

export const NODE_BEHAVIOR_ENTITIES = [
	NodeBehaviorCode,
	NodeBehaviorFunction,
	NodeBehaviorTrigger,
	...NODE_BEHAVIOR_PARAMETER_ENTITIES
] as const satisfies ReadonlyArray<Type<NodeBehaviorBase>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehavior = InstanceType<(typeof NODE_BEHAVIOR_ENTITIES)[number]>;
