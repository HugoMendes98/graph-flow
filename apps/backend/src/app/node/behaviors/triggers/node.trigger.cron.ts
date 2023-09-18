import { Embeddable, Property } from "@mikro-orm/core";
import {
	NodeTriggerCronDto as DTO,
	NodeTriggerType
} from "~/lib/common/app/node/dtos/behaviors/triggers";

import { NodeTriggerBase } from "./node.trigger.base";

@Embeddable({
	discriminatorValue: NodeTriggerType.CRON
})
export class NodeTriggerCron extends NodeTriggerBase implements DTO {
	/** @inheritDoc */
	public override readonly type = NodeTriggerType.CRON;

	/** @inheritDoc */
	@Property({ nullable: false })
	public cron!: string;
}
