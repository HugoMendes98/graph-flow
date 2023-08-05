import type { Type } from "@nestjs/common";

import { NodeTriggerBaseDto } from "./node.trigger.base.dto";
import { NodeTriggerCronDto } from "./node.trigger.cron.dto";

/**
 * The different DTOs for `node-trigger`
 */
export const NODE_TRIGGER_DTOS = [NodeTriggerCronDto] as const satisfies ReadonlyArray<
	Type<NodeTriggerBaseDto>
>;

/**
 * The union type of all node triggers
 */
export type NodeTriggerDto = InstanceType<(typeof NODE_TRIGGER_DTOS)[number]>;
