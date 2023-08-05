import { Embeddable } from "@mikro-orm/core";
import {
	NodeTriggerCronDto as DTO,
	NodeTriggerType
} from "~/lib/common/app/node/dtos/behaviors/triggers";

import { NodeTriggerBase } from "./node.trigger.base";

const type = NodeTriggerType.CRON;

@Embeddable({
	discriminatorValue: type
})
export class NodeTriggerCron extends NodeTriggerBase implements DTO {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeTriggerType.CRON;
}
