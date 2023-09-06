import { Type } from "@nestjs/common";

import {
	NodeBehaviorParameterBase,
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
} from "./parameters";

/**
 * All variant entities for `node-parameter`
 */
export const NODE_BEHAVIOR_PARAMETER_ENTITIES = [
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
] as const satisfies ReadonlyArray<Type<NodeBehaviorParameterBase>>;

export type NodeBehaviorParameter = InstanceType<(typeof NODE_BEHAVIOR_PARAMETER_ENTITIES)[number]>;
