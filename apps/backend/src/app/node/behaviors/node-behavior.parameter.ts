import { Type } from "@nestjs/common";

import {
	NodeBehaviorParameterBase,
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
} from "./parameters";

export const NODE_BEHAVIOR_PARAMETER_ENTITIES = [
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
] as const satisfies ReadonlyArray<Type<NodeBehaviorParameterBase>>;

export type NodeBehaviorParameter = InstanceType<(typeof NODE_BEHAVIOR_PARAMETER_ENTITIES)[number]>;
