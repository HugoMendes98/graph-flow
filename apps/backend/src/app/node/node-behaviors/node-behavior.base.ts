import { Embeddable, Enum } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/app/common/dtos/node/behaviors";

@Embeddable({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey
})
export abstract class NodeBehaviorBase implements NodeBehaviorBaseDto {
	@Enum({ items: () => NodeBehaviorType })
	public abstract readonly type: NodeBehaviorType;
}
