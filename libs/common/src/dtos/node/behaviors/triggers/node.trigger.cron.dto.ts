import { NodeTriggerBaseDto } from "./node.trigger.base.dto";
import { NodeTriggerType } from "./node.trigger.type";

export class NodeTriggerCronDto extends NodeTriggerBaseDto {
	public override readonly type = NodeTriggerType.CRON;
}
