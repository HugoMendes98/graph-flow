import { Embeddable, Enum } from "@mikro-orm/core";
import {
	NodeTriggerBaseDto,
	NodeTriggerDiscriminatorKey,
	NodeTriggerType
} from "~/app/common/dtos/node/behaviors/triggers";

@Embeddable({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeTriggerDiscriminatorKey
})
export abstract class NodeTriggerBase implements NodeTriggerBaseDto {
	@Enum({ items: () => NodeTriggerType })
	public abstract readonly type: NodeTriggerType;
}
