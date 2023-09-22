import type { Type } from "@nestjs/common";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorCodeDto } from "./node-behavior.code.dto";
import { NodeBehaviorFunctionDto } from "./node-behavior.function.dto";
import {
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto,
	NodeBehaviorVariableDto
} from "./node-behavior.parameter.dto";
import { NodeBehaviorReferenceDto } from "./node-behavior.reference.dto";
import { NodeBehaviorTriggerDto } from "./node-behavior.trigger.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DiscriminatedType } from "../../../../types";

/**
 * All the possible node behaviors (to generate type and subTypes)
 */
export const NODE_BEHAVIOR_DTOS = [
	{ name: NodeBehaviorType.CODE, value: NodeBehaviorCodeDto },
	{ name: NodeBehaviorType.FUNCTION, value: NodeBehaviorFunctionDto },
	{ name: NodeBehaviorType.PARAMETER_IN, value: NodeBehaviorParameterInputDto },
	{ name: NodeBehaviorType.PARAMETER_OUT, value: NodeBehaviorParameterOutputDto },
	{ name: NodeBehaviorType.REFERENCE, value: NodeBehaviorReferenceDto },
	{ name: NodeBehaviorType.TRIGGER, value: NodeBehaviorTriggerDto },
	{ name: NodeBehaviorType.VARIABLE, value: NodeBehaviorVariableDto }
] as const satisfies ReadonlyArray<DiscriminatedType<Type<NodeBehaviorBaseDto>, NodeBehaviorType>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorDto = InstanceType<(typeof NODE_BEHAVIOR_DTOS)[number]["value"]>;
