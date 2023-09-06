import { Type } from "@nestjs/common";

import { NodeTriggerBase } from "./node.trigger.base";
import { NodeTriggerCron } from "./node.trigger.cron";

/**
 * All the sub-entities for a `node-trigger`
 */
export const NODE_TRIGGER_ENTITIES = [NodeTriggerCron] as const satisfies ReadonlyArray<
	Type<NodeTriggerBase>
>;

/**
 * The union type of all node trigger
 */
export type NodeTrigger = InstanceType<(typeof NODE_TRIGGER_ENTITIES)[number]>;
