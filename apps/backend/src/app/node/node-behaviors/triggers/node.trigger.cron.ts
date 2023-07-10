import { Embeddable } from "@mikro-orm/core";
import {
	NodeTriggerCronDto as DTO,
	NodeTriggerType
} from "~/app/common/dtos/node/behaviors/triggers";

import { NodeTriggerBase } from "./node.trigger.base";

const type = NodeTriggerType.CRON;

@Embeddable({
	discriminatorValue: type
})
export class NodeTriggerCron extends NodeTriggerBase implements DTO {
	public override readonly type = NodeTriggerType.CRON;
}
