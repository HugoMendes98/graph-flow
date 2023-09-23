import { Type } from "@nestjs/common";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorCode } from "./node-behavior.code";
import { NodeBehaviorFunction } from "./node-behavior.function";
import { NodeBehaviorParameterInput } from "./node-behavior.parameter-input";
import { NodeBehaviorParameterOutput } from "./node-behavior.parameter-output";
import { NodeBehaviorReference } from "./node-behavior.reference";
import { NodeBehaviorTrigger } from "./node-behavior.trigger";
import { NodeBehaviorVariable } from "./node-behavior.variable";

/**
 * All subtypes for node behaviors
 */
export const NODE_BEHAVIOR_ENTITIES = [
	NodeBehaviorCode,
	NodeBehaviorFunction,
	NodeBehaviorReference,
	NodeBehaviorTrigger,
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
] as const satisfies ReadonlyArray<Type<NodeBehaviorBase>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorEntity = InstanceType<(typeof NODE_BEHAVIOR_ENTITIES)[number]>;
