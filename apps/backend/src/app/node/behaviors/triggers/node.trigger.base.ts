import { Embeddable, Enum } from "@mikro-orm/core";
import {
	NodeTriggerBaseDto,
	NodeTriggerDiscriminatorKey,
	NodeTriggerType
} from "~/lib/common/app/node/dtos/behaviors/triggers";

@Embeddable({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeTriggerDiscriminatorKey
})
export abstract class NodeTriggerBase implements NodeTriggerBaseDto {
	/**
	 * @inheritDoc
	 */
	@Enum({ items: () => NodeTriggerType })
	public abstract readonly type: NodeTriggerType;
}
