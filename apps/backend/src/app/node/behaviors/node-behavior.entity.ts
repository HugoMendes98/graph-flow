import { Type } from "@nestjs/common";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorCode } from "./node-behavior.code";
import { NodeBehaviorFunction } from "./node-behavior.function";
import { NODE_BEHAVIOR_PARAMETER_ENTITIES } from "./node-behavior.parameter";
import { NodeBehaviorReference } from "./node-behavior.reference";
import { NodeBehaviorTrigger } from "./node-behavior.trigger";

/**
 * All subtypes for node behaviors
 */
export const NODE_BEHAVIOR_ENTITIES = [
	NodeBehaviorCode,
	NodeBehaviorFunction,
	NodeBehaviorReference,
	NodeBehaviorTrigger,
	...NODE_BEHAVIOR_PARAMETER_ENTITIES
] as const satisfies ReadonlyArray<Type<NodeBehaviorBase>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorEntity = InstanceType<(typeof NODE_BEHAVIOR_ENTITIES)[number]>;
