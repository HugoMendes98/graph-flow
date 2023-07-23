import type { Type } from "@nestjs/common";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorCodeDto } from "./node-behavior.code.dto";
import { NodeBehaviorFunctionDto } from "./node-behavior.function.dto";
import {
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto,
	NodeBehaviorVariableDto
} from "./node-behavior.parameter.dto";
import { NodeBehaviorTriggerDto } from "./node-behavior.trigger.dto";

/**
 * All the possible node behaviors (to generate type and subTypes)
 */
export const NODE_BEHAVIOR_DTOS = [
	NodeBehaviorCodeDto,
	NodeBehaviorFunctionDto,
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto,
	NodeBehaviorTriggerDto,
	NodeBehaviorVariableDto
] as const satisfies ReadonlyArray<Type<NodeBehaviorBaseDto>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorDto = InstanceType<(typeof NODE_BEHAVIOR_DTOS)[number]>;
