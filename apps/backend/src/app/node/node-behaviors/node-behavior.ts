import { Type } from "@nestjs/common";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorCode } from "./node-behavior.code";
import { NodeBehaviorFunction } from "./node-behavior.function";
import { NodeBehaviorVariable } from "./node-behavior.variable";

export const NODE_BEHAVIORS_ENTITIES = [
	NodeBehaviorCode,
	NodeBehaviorFunction,
	NodeBehaviorVariable
] as const satisfies ReadonlyArray<Type<NodeBehaviorBase>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehavior = InstanceType<(typeof NODE_BEHAVIORS_ENTITIES)[number]>;
