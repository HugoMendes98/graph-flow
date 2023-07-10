import type { Type } from "@nestjs/common";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorCodeDto } from "./node-behavior.code.dto";
import { NodeBehaviorFunctionDto } from "./node-behavior.function.dto";
import { NodeBehaviorTriggerDto } from "./node-behavior.trigger.dto";
import { NodeBehaviorVariableDto } from "./node-behavior.variable.dto";

/**
 * All the possible node behaviors (to generate type and subTypes)
 */
export const NODE_BEHAVIOR_DTOS = [
	NodeBehaviorCodeDto,
	NodeBehaviorFunctionDto,
	NodeBehaviorTriggerDto,
	NodeBehaviorVariableDto
] as const satisfies ReadonlyArray<Type<NodeBehaviorBaseDto>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorDto = InstanceType<(typeof NODE_BEHAVIOR_DTOS)[number]>;
