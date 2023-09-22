import type { Type } from "@nestjs/common";

import { NodeTriggerBaseDto } from "./node.trigger.base.dto";
import { NodeTriggerCronDto } from "./node.trigger.cron.dto";
import { NodeTriggerType } from "./node.trigger.type";
import { DiscriminatedType } from "../../../../../types";

/**
 * The different DTOs for `node-trigger`
 */
export const NODE_TRIGGER_DTOS = [
	{ name: NodeTriggerType.CRON, value: NodeTriggerCronDto }
] as const satisfies ReadonlyArray<DiscriminatedType<Type<NodeTriggerBaseDto>, NodeTriggerType>>;

/**
 * The union type of all node triggers
 */
export type NodeTriggerDto = InstanceType<(typeof NODE_TRIGGER_DTOS)[number]["value"]>;
