import { NodeTriggerBaseDto } from "./node.trigger.base.dto";
import { NodeTriggerType } from "./node.trigger.type";

/**
 * DTO for `node-trigger` of subtype CRON
 */
export class NodeTriggerCronDto extends NodeTriggerBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeTriggerType.CRON;
}
